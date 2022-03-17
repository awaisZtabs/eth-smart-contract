App = {
    loading: false,
    contracts: {},
    load: async () => {
        /* load data from block chain. */
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();

    },
    /* web3 basically connects browser to block chain.  */
    loadWeb3: async () => {
        window.addEventListener('load', async () => {
            // Modern dapp browsers...
            if (window.ethereum) {
                window.web3 = new Web3(ethereum);
                try {
                    // Request account access if needed
                    await ethereum.enable();
                    // Acccounts now exposed
                    web3.eth.sendTransaction({
                        /* ... */
                    });
                } catch (error) {
                    // User denied account access...
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                window.web3 = new Web3(web3.currentProvider);
                // Acccounts always exposed
                web3.eth.sendTransaction({
                    /* ... */
                });
            }
            // Non-dapp browsers...
            else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        });
    },

    loadAccount: async () => {
        // connect to all the accounts, we want index 0 since, its the first account
        // the account we are connected to
        App.account = await ethereum.request({
            method: 'eth_accounts'
        });

        console.log(App.account);
    },
    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
            loader.show()
            content.hide()
        } else {
            loader.hide()
            content.show()
        }
    },
    loadContract: async () => {
        const TodoList = await $.getJSON('TodoList.json');
        App.contracts.TodoList = TruffleContract(TodoList);
        App.contracts.TodoList.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

        /* get values from block chain. */
        App.TodoList = await App.contracts.TodoList.deployed();
    },
    renderTask: async () => {
        /* load task from blockchain */
        const taskCount = await App.TodoList.taskCount();
        const $taskTemplate = $(".taskTemplate");
        /* render each task with tempalated */
        for (var i = 1; i <= taskCount; i++) {
            const task = await App.TodoList.tasks(i);
            const taskId = task[0].toNumber();
            const taskContent = task[1];
            const taskCompleted = task[2];

            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskContent)
            $newTaskTemplate.find('input')
                .prop('name', taskId)
                .prop('checked', taskCompleted)
                .on('click', App.toggleCompleted);
            // Put the task in the correct list
            if (taskCompleted) {
                $('#completedTaskList').append($newTaskTemplate)
            } else {
                $('#taskList').append($newTaskTemplate)
            }

            // Show the task
            $newTaskTemplate.show()
        }
        /* show task */

    },
    render: async () => {
        if (App.loading) {
            return
        }
        // Update app loading state
        App.setLoading(true)
        // Render Account
        $('#account').html(App.account)
        App.setLoading(false)
       await App.renderTask();
    },

    createTask: async () => 
    {
        App.setLoading(true)
        const content = $('#newTask').val();
        await App.TodoList.createTask(content, { from:  App.account});
        window.location.reload();
    },
    toggleCompleted: async(e) => 
    {
            App.setLoading(true)
    const taskId = e.target.name
    await App.TodoList.toggleCompleted(taskId, { from:  App.account})
    window.location.reload()
    }
}
/* ready */
$(() => {
    $(window).load(() => {
        App.load();
    })
});

/* truffle contract => smart contract in JS */