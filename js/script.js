window.addEventListener('DOMContentLoaded', () => {

    // Tabs

    const contents = document.querySelectorAll('.tabcontent'),
        tabs = document.querySelector('.tabheader__items'),
        items = document.querySelectorAll('.tabheader__item');

    function hideContent () {
        contents.forEach( item => {
            item.classList.add('hide');
            item.classList.remove('show');
        });
        items.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });

    }
    function showContent (i = 0) {
        contents[i].classList.remove('hide');
        contents[i].classList.add('show', 'fade');
        items[i].classList.add('tabheader__item_active');
    }
    hideContent ();
    showContent ();

    tabs.addEventListener('click', (e) => {
        let target = e.target;
        if (target && target.classList.contains('tabheader__item')) {
            items.forEach((item, i) => {
                if (item == target) {
                    hideContent ();
                    showContent (i);
                }
            });
        }
    });

    //time

    const dateLine = new Date('2020-08-18T07:45:00');

    function getTimeRemanding (endTime) {
        const t = Date.parse(endTime) - Date.parse(new Date()),
            desy = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / (1000 * 60)) % 60),
            seconds = Math.floor((t /1000) % 60);

        return {
            'total': t,
            'desy': desy,
            'hours':hours, 
            'minutes':minutes, 
            'seconds':seconds
        };   
    }

    function getZiro (sum) {
        if (sum >= 0 && sum < 10) {
           return `0${sum}`;
        }else {
            return sum;
        }
    }
    function setClock (celectir, andTime) {
        let timer = document.querySelector(celectir),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval (updadeClock, 1000);

        updadeClock ();

        function updadeClock () {
            const t = getTimeRemanding(andTime);
                days.innerHTML = getZiro(t.desy);
                hours.innerHTML = getZiro (t.hours);
                minutes.innerHTML = getZiro (t.minutes);
                seconds.innerHTML = getZiro (t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    setClock ('.timer', dateLine);

    // Modal Window

    const btns = document.querySelectorAll('[data-modal]'),
          exit = document.querySelector('[data-close]'),
          modal = document.querySelector('.modal'),
          openModal = setTimeout(showModal, 5000);

    function showModal () {
        modal.style = 'display: block;';
        document.body.style.overflow = 'hidden'; 
        clearInterval(openModal);
    }
    function hiddenModal () {
        modal.style = 'display: none;';
        document.body.style.overflow = '';  
    }
    function scrollModal() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.
            documentElement.scrollHeight) {
                showModal ();
                window.removeEventListener('scroll', scrollModal);
        }
    }

    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target) {
                showModal ();
            }
        });
    });
    exit.addEventListener('click', (e) => {
        if (e.target) {
            hiddenModal (); 
        }
    });
    modal.addEventListener('click', (e) => {
        if (e.target == modal) {
            hiddenModal (); 
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.code == 'Escape'&& (modal.style = 'display: block;')) {
            hiddenModal ();
        }
        
    });
    window.addEventListener('scroll', scrollModal);

    //  Class

    class CardItem {
        constructor (price,src,title, descr, alt, selector, ...clases) {
            this.src = src;
            this.title = title;
            this.descr = descr;
            this.alt = alt;
            this.selector = document.querySelector(selector);
            this.clases = clases;
            this.price = price;
            this.transfer = 27;
            this.changeToUAN();
        }
        changeToUAN() {
            this.price = +this.price * this.transfer;
        }
        render () {
            const element = document.createElement('div');

            if(this.clases.length === 0) {
                this.clases = 'menu__item';
                element.classList.add(this.clases);
            }else{
                this.clases.forEach( item => element.classList.add(item));
            }
            
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.selector.append(element);
        }
    }

    new CardItem(
        8,
        "img/tabs/vegy.jpg",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        "vegy",
        '.menu .container'
        ).render();

    new CardItem(
        20,
        "img/tabs/elite.jpg",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        "elite",
        '.menu .container'
        ).render();

    new CardItem(
        16,
        "img/tabs/post.jpg",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        "post",
        '.menu .container'
        ).render();

        // Forms

        const forms = document.querySelectorAll('form');
        const message = {
            loading: 'Загрузка...',
            success: 'Спасибо! Скоро мы с вами свяжемся',
            failure: 'Что-то пошло не так...'
        };
    
        forms.forEach(item => {
            postData(item);
        });
    
    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.appendChild(statusMessage);
        
            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });
            const json = JSON.stringify(object);

            request.send(json);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    statusMessage.textContent = message.success;
                    form.reset();
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 2000);
                } else {
                    statusMessage.textContent = message.failure;
                }
            });
        });
    }
});