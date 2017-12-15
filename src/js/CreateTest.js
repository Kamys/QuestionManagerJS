$(function () {
    const listQuestion = $('#list-question');
    let currentItem;

    const dataQuestion = [
        {question: "В каком году родился Пушкин A. С. ?", answer: "1799", point: 11},
        {question: "5 + 5 = ?", answer: "10", point: 25},
        {question: "Столица Бельгии?", answer: "Брюссель", point: 5},
        {
            question: "Как называется группа файлов, которая хранится отдельной группой и имеет собственное имя?",
            answer: "Каталог",
            point: 4
        },
        {question: "Как называются данные или программа на магнитном диске?", answer: "Файл", point: 7},
        {

            question: "Какое наибольшее количество символов имеет имя файла или каталога в Windows?",
            answer: "255",
            point: 12
        },
        {question: "Какое наибольшее количество символов имеет расширение имени файла?", answer: "3", point: 16},
    ];

    initChangeInput();
    initListenerButton();
    updateList();

    function initChangeInput() {
        $('#question-input').on('input', inputQuestion);
        $('#answer-input').on('input', inputQuestion);
        $('#point-input').on('input', inputQuestion);

        function inputQuestion() {
            $('#question-btn-save').prop('disabled', false);
        }
    }

    function initListenerButton() {
        $('#question-btn-save').click(saveQuestion);
        $('#question-btn-add').click(addQuestion);
        $('#question-btn-delete').click(deleteCurrentQuestion);
        $('#test-btn-save').click(saveTest);
    }
    
    function saveTest() {
        const testJson = JSON.stringify(dataQuestion);
        $.cookie("test-data", testJson);
        toastr.success("Test save.");
    }

    function updateList() {
        listQuestion.empty();
        dataQuestion.forEach(function (question, index) {
            const tab = createTabQuestion(index, question.question);
            listQuestion.append(tab)
        });
        $(".list-group-item").click(itemClick);
    }

    function itemClick() {
        const index = $(this).attr('index');
        selectQuestion(index);
    }

    function selectQuestion(index) {
        currentItem = index;
        showQuestion(dataQuestion[index]);
    }

    function createTabQuestion(index, name) {
        return $(`
        <a
            class="list-group-item list-group-item-action"
            data-toggle="list"
            role="tab"
            index="${index}"
        >${name || "Имя вопроса"}</a>`);
    }

    function showQuestion(itemQuestion) {
        $('#question-input').val(itemQuestion.question);
        $('#answer-input').val(itemQuestion.answer);
        $('#point-input').val(itemQuestion.point);
    }

    function addQuestion() {
        dataQuestion.push({question: "Вопрос " + dataQuestion.length, answer: "", point: 0});
        updateList();
        selectQuestion(dataQuestion.length - 1);
    }

    function saveQuestion() {
        dataQuestion[currentItem].question = $('#question-input').val();
        dataQuestion[currentItem].answer = $('#answer-input').val();
        dataQuestion[currentItem].point = $('#point-input').val();
        updateList();
        $('#question-btn-save').prop('disabled', true);
    }

    function deleteCurrentQuestion() {
        delete dataQuestion[currentItem];
        updateList();
        $('#question-input').val('');
        $('#answer-input').val('');
        $('#point-input').val('');
    }
});