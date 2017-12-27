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
            $('#question-input').val(question.question);
            $('#answer-input').val(question.answer);
            $('#point-input').val(question.point);
            $('#question-btn-delete').prop('disabled', false);
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
            $('#question-btn-delete').prop('disabled', true);
            toastr.info("Вопрос удалён")
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
            }
        }
    }());

    const listTest = $('#list-test');
    const listQuestion = $('#list-question');
    let currentTest;


    questionManager.init();

    $('#test-btn-save').click(saveTest);
    $('#test-btn-add').click(function () {
        let length = dataTest.length;
        dataTest.push({id: length, name: "Тест " + length, maxPoint: 0, questions:[]});
        updateListTest();
        showTest(dataTest[length]);
    });
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
        $('#test-input-name').val(test.name);
        $('#test-input-max-points').val(test.maxPoint);
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