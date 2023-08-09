/* Получает родителя родителя */
Node.prototype.grandparentNode = function() {
    return this.parentNode.parentNode;
}

/* Самоудаление элемента */
Node.prototype.selfRemove = function() {
    this.parentNode.removeChild(this);
}
/* Создает оберточный блок для элемента. Блок вставляется в то место, где находился элемент */
Node.prototype.wrap = function(className) {
    let wrapper = document.createElement("div");
    wrapper.classList.add(className);
    this.parentNode.insertBefore(wrapper, this);
    wrapper.appendChild(this);
    return wrapper;
}
/* Проверяет наличие класса  */
Node.prototype.hasClass = function(className) {
    return this.classList.contains(className);
}
/* Добавляет класс элементу */
Node.prototype.addClass = function(className) {
    this.classList.add(className);
}
/* Удаляет класс у элемента */
Node.prototype.removeClass = function(className) {
    this.classList.remove(className);
}
/* 
    Реализация функционала модальных окон. Метод используется на элементе, который является ссылкой для открытия 
    модального окна. Для работы метода необходимо:
    1) модальное окно и ссылка для его открытия должны иметь класс custom-modal
    2) ссылка должна иметь класс open-link, а окно -- open-modal
    3) оба элемента должны иметь одинковый атрибут data-modal
    4) по умолчанию у открытого модального окна добавляется класс modal-shown, размещающий элемент как блок. Для отображения 
        иначе используется класс modal-shown-<display>, где <display> -- способ отображения элемента
*/
Node.prototype.modal = function() {
    if (!this instanceof Node) return false;
    if (!this.hasClass('custom-modal') || !this.hasClass('open-link') || !this.hasAttribute('data-modal')) return false;
    let dataModal = this.dataset.modal;
    let modalWindow = document.querySelector(`.custom-modal.open-modal[data-modal="${dataModal}"]`);
    if (!modalWindow) return false;
    let displayModal = modalWindow.dataset.modalDisplay;
    this.addEventListener('click', function(e) {
        e.stopPropagation();
        modalWindow.addClass(displayModal && displayModal != '' ? `modal-shown-${displayModal}` :  'modal-shown');
    });
    modalWindow.addEventListener('click', function(e) {
        e.stopPropagation();
    })
    let closeModals = function(e) {
        document.querySelectorAll(`.custom-modal.open-modal.modal-shown, .custom-modal.open-modal.modal-shown-${displayModal}`).forEach(item => {
            item.removeClass('modal-shown');
            if( displayModal && displayModal != '' ) item.removeClass(`modal-shown-${displayModal}`);
        })
    }
    let closeLink = modalWindow.querySelector('a.close');
    if (closeLink) {
        closeLink.addEventListener('click', function(e) {
            modalWindow.removeClass('modal-shown');
            if( displayModal && displayModal != '' ) modalWindow.removeClass(`modal-shown-${displayModal}`);
        });
    }
    document.removeEventListener('click', closeModals);
    document.addEventListener('click', closeModals);
}

document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.custom-modal.open-link')
    links.forEach(item => {
        item.modal();
    });
});


Node.prototype.on = function(event, selector, callback) {
    if (typeof event !== 'string' || typeof selector !== 'string' || typeof callback !== 'function') {
        return false;
    }
    this.addEventListener(event, function(e) {
        let elems = Array.from(this.querySelectorAll(selector));
        let target = e.target;
        if (elems.indexOf(target) != -1) {
            callback(e);
        }
    });
    return true;
     
}