$(function () {
    const questionHist = [
        {question: "В каком году родился Пушкин A. С. ?", answer: "1799", point: 11},
        {question: "5 + 5 = ?", answer: "10", point: 25},
        {question: "В каком году основан воронеж?", answer: "1586", point: 25},
        {question: "Столица Бельгии?", answer: "Брюссель", point: 5}
    ];

    const questionInf = [
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

    const dataTest = [
        {id: 0, name: "История", maxPoint: 11, questions: questionHist},
        {id: 1, name: "Информатика", maxPoint: 11, questions: questionInf}
    ];

    const listTest = $('#list-test');
    const listQuestion = $('#list-question');
    let currentItem;
    let currentQuestions;

    initChangeInput();
    initListenerButton();
    initListTest();

    updateList(dataTest, listTest, x => x.name, showTest);


    function initListTest() {
        listTest.empty();
    }

    function showTest(test) {
        $('#test-input').val(test.name);
        $('#max-points-input').val(test.maxPoint);

        let questions = test.questions;
        updateList(questions, listQuestion, q => q.question, showQuestion);
        currentQuestions = questions;
        if(questions.length !== 0){
            showQuestion(questions[0]);
        }
    }

    function updateList(listData, DDL, getName, click) {
        DDL.empty();
        listData.forEach(function (item, index) {
            const tab = createDDLItem(index, getName(item));
            DDL.append(tab)
        });
        $(".list-group-item").click(itemClick);

        function itemClick() {
            const index = $(this).attr('index');
            let item = listData[index];
            click(item);
        }
    }


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
        const testJson = JSON.stringify(currentQuestions);
        $.cookie("test-data", testJson);
        toastr.success("Test save.");
    }


    function selectQuestion(question) {
        currentItem = question;
        showQuestion(question);
    }

    function createDDLItem(index, name) {
        return $(`
        <a
            class="list-group-item list-group-item-action"
            data-toggle="list"
            role="tab"
            index="${index}"
        >${name || "Имя вопроса"}</a>`);
    }

    function showQuestion(question) {
        $('#question-input').val(question.question);
        $('#answer-input').val(question.answer);
        $('#point-input').val(question.point);
    }

    function addQuestion() {
        currentQuestions.push({question: "Вопрос " + currentQuestions.length, answer: "", point: 0});
        updateListCurrentQuestions();
        selectQuestion(currentQuestions.length - 1);
    }

    function saveQuestion() {
        currentItem.question = $('#question-input').val();
        currentItem.answer = $('#answer-input').val();
        currentItem.point = $('#point-input').val();
        updateListCurrentQuestions();
        $('#question-btn-save').prop('disabled', true);
    }

    function deleteCurrentQuestion() {
        delete currentQuestions[currentItem];
        updateListCurrentQuestions();
        $('#question-input').val('');
        $('#answer-input').val('');
        $('#point-input').val('');
    }

    function updateListCurrentQuestions(){
        updateList(currentQuestions, listQuestion, q => q.question, selectQuestion);
    }
});