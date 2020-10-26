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

    const dateLine = new Date('2020-12-18T07:45:00');

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
          modal = document.querySelector('.modal'),
          modalTimerId = setTimeout(openModal, 50000);

    function openModal () {
        modal.classList.remove('hide');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; 
        clearInterval(modalTimerId);
    }
    function closeModal () {
        modal.classList.add('hide');
        document.body.style.overflow = '';  
    }
    function scrollModal() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.
            documentElement.scrollHeight) {
                openModal ();
                window.removeEventListener('scroll', scrollModal);
        }
    }

    btns.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target == modal || e.target.getAttribute('data-close') == '') {
            closeModal (); 
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.code == 'Escape'&& (modal.style = 'display: block;')) {
            closeModal ();
        }
        
    });
    window.addEventListener('scroll', scrollModal);

    //  Class

    class CardItem {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH(); 
        }

        changeToUAH() {
            this.price = this.price * this.transfer; 
        }
        
        render () {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
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
            this.parent.append(element);
        }
    }

    getResource('http://localhost:3000/menu')
    .then(data => {
        data.forEach(({img, altimg, title, descr, price}) => {
            new CardItem(img, altimg, title, descr, price,".menu .container").render();
        });
    });

    // Forms
    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'icons/modal/spinner.svg',
        success: 'Спасибо! Мы скоро с вами свяжемся.',
        failure: 'Что-то пошло не так...',
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const  postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        return await res.json();
    };
    
    async function getResource(url) {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const statusMesage = document.createElement('img');
            statusMesage.src = message.loading;
            statusMesage.style.cssText = `display: block; margin: 0 auto;`;
            form.insertAdjacentElement('afterend', statusMesage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMesage.remove(); 
            }).catch(()=> {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }
    
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');
        openModal();
        
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
        </div>`;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(()=> {
            thanksModal.remove();
            prevModalDialog.classList.remove('hide');
            prevModalDialog.classList.add('show');
            closeModal();
        }, 2000);
    }
    // fetch('http://localhost:3000/menu')
    // .then(data => data.json())
    // .then(data => {
    //     console.log(data);
    // });

    // let s = ['s', 5];
    // const jsonss = JSON.stringify(Object.fromEntries(Object.entries(s)));
    // console.log(JSON.parse(jsonss));

});
