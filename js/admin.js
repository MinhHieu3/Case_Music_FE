let currentPage = 1; // Trang hiện tại, mặc định là trang đầu tiên
let totalPages = 0;
const itemsPerPage = 10; // Số lượng mục trên mỗi trang

function showListUser() {
    axios.get(`http://localhost:8080/admin`).then(response => {
        let data = response.data;

        totalPages = Math.ceil(data.length/itemsPerPage);
        // Tính toán chỉ số bắt đầu và kết thúc của mục trên trang hiện tại
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, data.length);

        let str = `<table id="user-table" class="table table-bordered table-dark" style="width:100%">
                        <tr>
                            <th>Avatar</th>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Enabled</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th></th>
                        </tr>`;

        for (let i = startIndex; i < endIndex; i++) {
            let user = data[i];
            let enabledStatus = user.enabled ? `Active` : `Inactive`;
            let roleStatus = user.roles[0].name === "ROLE_USER" ? `User` : `Author`;

            str += `<tr>
                        <td id="avt-${user.id}"><img src="${user.avt}" alt="User Avatar"></td>
                        <td id="username-${user.id}">${user.username}</td>
                        <td id="name-${user.id}">${user.name}</td>
                        <td id="enabled-${user.id}">${enabledStatus}</td>
                        <td id="phone-${user.id}">${user.phone}</td>
                        <td id="roles-${user.id}">${roleStatus}</td>
                        <td><button onclick="changeEnabled(${user.id})" class="btn btn-success">Change</button></td>
                    </tr>`;
        }
        str += `</table>`;

        // Thêm nút điều hướng phân trang
        if (totalPages > 1) {
            str += `<button onclick="previousPage()" class="btn btn-success">Previous</button>
                    <button onclick="nextPage()" class="btn btn-success">Next</button>`;
        }

        document.getElementById(`user-table`).innerHTML = str;
        document.getElementById("back-user").style.display = "none";
    }).catch(error => {
        console.error('Error fetching user data:', error);
    });
}
// Thay đổi trạng thái tài khoản
function changeEnabled(id) {
    let data = {
        avt: document.getElementById(`avt-${id}`).getAttribute('src'),
        username: document.getElementById(`username-${id}`).value,
        name: document.getElementById(`name-${id}`).value,
        enabled: document.getElementById(`enabled-${id}`).value,
        phone: document.getElementById(`phone-${id}`).value,
        roles: document.getElementById(`roles-${id}`).value,
    };

    axios.put(`http://localhost:8080/admin/${id}`, data).then(() => {
        showListUser();
    }).catch(error => {
        console.error('Error updating user:', error);
    });
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        showListUser();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        showListUser();
    }
}

showListUser();
