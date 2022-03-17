pragma solidity >=0.5.0;


contract TodoList
{
  uint public taskCount = 0;

    struct Task{
    uint id;
    string content;
    bool completed;
    }
    mapping(uint => Task) public tasks;

    event taskCreated (
    uint id,
    string content,
    bool completed
    )  ;
    constructor()  public
    {
            createTask("WakeUp Sid");
    }
    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
    emit taskCreated(taskCount, _content, false);
    }
}
