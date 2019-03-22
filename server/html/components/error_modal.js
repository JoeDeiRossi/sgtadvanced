
class ErrorModal {
    constructor(errorArray) {
        this.errorArray = errorArray;
    }

    render() {
        var newModal = $('<div>',{
            id: 'errorModal',
        });

        var modalContent = $('<div>',{
            id: 'modalContent',
        })

        var modalTitle = $('<div>',{
            id: 'modalTitle',
            text: 'Error(s):',
        });

        var errorsContainer = $('<div>',{
            id: 'errorsContainer',
        });

        var errorsList = $('<ul>',{
            id: 'errorsList',
        });

        for (var errorIndex = 0; errorIndex < this.errorArray.length; errorIndex++) {
            var errorListItem = $('<li>',{
                text: this.errorArray[errorIndex],
            });
            errorsList.append(errorListItem);
        };

        var modalClose = $('<button id="modalClose">&times;</button>').on('click', this.deleteModal);

        newModal.append(modalContent);
        modalTitle.append(modalClose);
        modalContent.append(modalTitle, errorsContainer);
        errorsContainer.append(errorsList);
        $('body').append(newModal);
    }

    deleteModal() {
        var modal = $(this).parent().parent().parent();
        modal.remove();
    }
}