//テーブル情報の取得・表示
function reloadTable() {
    fetch("api.php?action=fetchData")
        .then(response => response.text())  // レスポンスをテキストで取得
        .then(text => {
            console.log("Raw response:", text);
            return JSON.parse(text);
        })
        .then(data => {
            let output = "";
            data.forEach(todo => {
                output += "<tr>"
                output += `<td class="title">${todo.title} </td>`;
                output += `<td class="description">${todo.description}</td>`;
                output += `<td><button class="editTodo" data-id="${todo.id}">編集</button></td>`
                output += `<td><button class="duplicateTodo" data-id="${todo.id}">複製</button></td>`
                output += `<td><button class="deleteTodo" data-id="${todo.id}">削除</button></td>`
            });
            output += "</tr>";
            document.getElementById("todoList").innerHTML = output;
        });
}

window.onload = reloadTable();

//再読込ボタン
document.getElementById("loadTodos").addEventListener("click", reloadTable());

//レコード編集
document.addEventListener('click', function (event) {
    // 'editTodo' クラスか確認
    if (event.target.classList.contains('editTodo')) {
        const button = event.target;
        const row = button.closest('tr');
        const id = button.getAttribute('data-id');
        const titleCell = row.querySelector('.title');
        const descriptionCell = row.querySelector('.description');

        if (button.textContent === '編集') {// 編集操作
            //バリデーション
            const isEditable = document.getElementById('isEditable').getAttribute('value');
            if (isEditable !== 'true') return;

            const titleInput = document.createElement('input');
            titleInput.value = titleCell.textContent;
            const descriptionInput = document.createElement('input');
            descriptionInput.value = descriptionCell.textContent;

            titleCell.textContent = '';
            titleCell.appendChild(titleInput);
            descriptionCell.textContent = '';
            descriptionCell.appendChild(descriptionInput);

            button.textContent = '確定';
            document.getElementById('isEditable').setAttribute('value', 'false');
        } else { // 確定操作            
            const updatedData = {
                title: titleCell.querySelector('input').value,
                description: descriptionCell.querySelector('input').value,
            };

            fetch(`api.php?action=updateData&id=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            })
                .then(response => response.text())
                .then(text => {
                    console.log("Raw response:", text);
                    return JSON.parse(text);
                })
                .then(data => {
                    if (data.success) {
                        // ブラウザ上の値を更新
                        titleCell.textContent = updatedData.title;
                        descriptionCell.textContent = updatedData.description;
                    }
                });
            button.textContent = '編集';
            document.getElementById('isEditable').setAttribute('value', 'true');
        }
    }
});

//データ追加ボタン
document.getElementById('addTodo').addEventListener('click', function () {
    const formContainer = document.getElementById('addTodoFormContainer');
    formContainer.style.display = (formContainer.style.display === 'none' || formContainer.style.display === '') ? 'block' : 'none';
});

//データを追加する
document.getElementById('addTodoForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const newTodoData = {
        title: document.getElementById('newTitle').value,
        description: document.getElementById('newDescription').value
    };

    fetch('api.php?action=insertData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodoData)
    })
        .then(response => response.text())
        .then(text => {
            console.log("Raw response:", text);
            return JSON.parse(text);
        })
        .then(data => {
            if (data.success) {
                // Update UI to show new todo
                reloadTable();
            }
        });
});

//削除ボタン
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('deleteTodo')) {
        const id = event.target.getAttribute('data-id');
        fetch(`api.php?action=deleteData&id=${id}`, {
            method: 'POST'
        })
            .then(response => response.text())
            .then(text => {
                console.log("Raw response:", text);
                return JSON.parse(text);
            })
            .then(data => {
                if (data.success) {
                    // Remove row from UI
                    reloadTable();
                }
            });
    }
});

//複製ボタン
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('duplicateTodo')) {
      const row = event.target.closest('tr');
      const title = row.querySelector('.title').textContent;
      const description = row.querySelector('.description').textContent;
  
      //転記
      document.getElementById('newTitle').value = title;
      document.getElementById('newDescription').value = description;
  
      //表示
      const formContainer = document.getElementById('addTodoFormContainer');
      formContainer.style.display = 'block';
    }
  });

 //CSV出力ボタン
document.getElementById('exportCsv').addEventListener('click', function() {
    fetch('api.php?action=exportCsv')
    .then(response => response.text())
    .then(data => {
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', 'todos.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  });