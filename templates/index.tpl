<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="./style.css">
    <title>TODOリスト</title>
</head>

<body>
    <h1>TODOリスト</h1>
    <button id="loadTodos">再読込</button>
    <button id="addTodo" class="button">データ追加</button>
    <button id="exportCsv">CSV出力</button>
    <div id="addTodoFormContainer" style="display: none;">
        <form id="addTodoForm">
            <input type="text" id="newTitle" placeholder="Title">
            <input type="text" id="newDescription" placeholder="Description">
            <button type="submit">追加する</button>
        </form>
    </div>
    <table>
        <thead>
            <tr>
                <th colspan="1">タイトル</th>
                <th colspan="1">内容</th>
                <th colspan="3">操作</th>

            </tr>
        </thead>
        <tbody id="todoList">
        </tbody>
    </table>
    <input type="hidden" id="isEditable" value="true">

    <script src="./script.js"></script>
</body>

</html>