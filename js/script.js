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
        openModal = setTimeout(showModal, 3000);

    function showModal () {
        modal.style = 'display: block;';
        document.body.style.overflow = 'hidden'; 
        clearInterval(openModal);
    }
    function noneModal () {
        modal.style = 'display: none;';
        document.body.style.overflow = '';  
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
            noneModal (); 
        }
    });
    modal.addEventListener('click', (e) => {
        if (e.target == modal) {
            noneModal (); 
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.code == 'Escape'&& (modal.style = 'display: block;')) {
            noneModal ();
        }
        
    });

    function scrollModal() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.
            documentElement.scrollHeight) {
                showModal ();
                window.removeEventListener('scroll', scrollModal);
        }
    }
    
    window.addEventListener('scroll', scrollModal);
});