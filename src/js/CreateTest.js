$(function () {
    dataTest = new DataProvider().getTests();

    const questionManager = (function () {
        let questions;
        let questionEdit;
        let updateListQuestions = function () {
            updateList(currentTest.questions, listQuestion, q => q.question, show);
        };
        let initChangeInput = function () {
            $('#question-input').on('input', inputQuestion);
            $('#answer-input').on('input', inputQuestion);
            $('#point-input').on('input', inputQuestion);

            function inputQuestion() {
                $('#question-btn-save').prop('disabled', false);
            }
        };
        let show = function (question) {
            $('#question-input').val(question.question).prop('disabled', false);
            $('#answer-input').val(question.answer).prop('disabled', false);
            $('#point-input').val(question.point).prop('disabled', false);
            $('#question-btn-delete').prop('disabled', false);
            $('#question-btn-add').prop('disabled', false);
            questionEdit = question;
        };

        let addQuestion = function () {
            let length = questions.length;
            questions.push({question: "Вопрос " + length, answer: "", point: 0});
            updateListQuestions();
            show(questions[length]);
        };

        let save = function () {
            questionEdit.question = $('#question-input').val();
            questionEdit.answer = $('#answer-input').val();
            questionEdit.point = $('#point-input').val();
            updateListQuestions();
            $('#question-btn-save').prop('disabled', true);
            saveData();
        };

        let deleteCurrent = function () {
            let indexOf = questions.indexOf(questionEdit);
            questions.splice(indexOf, 1);
            updateListQuestions();
            $('#question-input').val('');
            $('#answer-input').val('');
            $('#point-input').val('');
            hideInput();
            $('#question-btn-delete').prop('disabled', true);
            toastr.info("Вопрос удалён")
        };

        let hideInput = function () {
            $('#question-input').prop('disabled', true);
            $('#answer-input').prop('disabled', true);
            $('#point-input').prop('disabled', true);
        };

        let hideBtn = function () {
            $('#question-btn-add').prop('disabled', true);
            $('#question-btn-delete').prop('disabled', true);
            $('#question-btn-save').prop('disabled', true);
        };

        return {
            init: function () {
                $('#question-btn-save').click(save)
                    .prop('disabled', true);
                $('#question-btn-add').click(addQuestion);
                $('#question-btn-delete').click(deleteCurrent)
                    .prop('disabled', true);
                initChangeInput();
            },
            setQuestion: function (data) {
                questions = data;
                updateListQuestions();
                if (questions.length !== 0) {
                    show(questions[0]);
                }
            },
            hide: function () {
                hideInput();
                hideBtn();
            }
        }
    }());

    const listTest = $('#list-test');
    const listQuestion = $('#list-question');
    let currentTest;


    questionManager.init();
    questionManager.hide();

    $('#test-input-name').prop('disabled', true);
    $('#test-input-max-points').prop('disabled', true);

    $('#test-btn-save').click(saveTest);
    $('#test-btn-add').click(function () {
        let length = dataTest.length;
        dataTest.push({id: length, name: "Тест " + length, maxPoint: 0, questions: []});
        updateListTest();
        showTest(dataTest[length]);
    });
    $('#test-btn-delete').click(function () {
        let indexOf = dataTest.indexOf(currentTest);
        dataTest.splice(indexOf, 1);
        updateListTest();
        $('#test-input-name').val('').prop('disabled', true);
        $('#test-input-max-points').val('').prop('disabled', true);
        $('#test-btn-delete').prop('disabled', true);
        questionManager.hide();
        toastr.info("Тест удалён")
    }).prop('disabled', true);

    updateListTest();
    initChangeInputTest();

    function initChangeInputTest() {
        $('#test-input-name').on('input', inputTest);
        $('#test-input-max-points').on('input', inputTest);

        function inputTest() {
            $('#test-btn-save').prop('disabled', false);
        }
    }

    function updateListTest() {
        updateList(dataTest, listTest, x => x.name, showTest);
    }

    function showTest(test) {
        $('#test-input-name').val(test.name).prop('disabled', false);
        $('#test-input-max-points').val(test.maxPoint).prop('disabled', false);
        $('#test-btn-delete').prop('disabled', false);
        $('#question-btn-add').prop('disabled', false);
        currentTest = test;

        let questions = test.questions;
        questionManager.setQuestion(questions);
    }

    function saveTest() {
        currentTest.name = $('#test-input-name').val();
        currentTest.maxPoint = $('#test-input-max-points').val();
        $('#test-btn-save').prop('disabled', true);
        saveData();
        updateListTest();
    }

    function saveData() {
        new DataProvider().saveTest(dataTest)
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

    function updateList(listData, DDL, getName, click) {
        DDL.empty();
        listData.forEach(function (item, index) {
            const tab = createDDLItem(index, getName(item));
            tab.click(itemClick);
            DDL.append(tab)
        });

        function itemClick() {
            const index = $(this).attr('index');
            let item = listData[index];
            click(item);
        }
    }
});