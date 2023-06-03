function initApp() {
    const X$ = document.querySelector.bind(document);
    const X$$ = document.querySelectorAll.bind(document);
    const body = X$('body');

    const getTodo = async (url) => { return (await fetch(url)).json() };

    const stickyEl1 = X$('.container-branch .box');
    const stickyEl2 = X$('.container-right__content');
    const stickyEl3 = X$('.container-left__menu')
    stickyElement(stickyEl1, X$('.container-branch'), null, 1);
    stickyElement(stickyEl2, X$('.container-right'), null, 2);
    stickyElement(stickyEl3, X$('.container-left'), 'sticky', 1);

    if (STORAGE('memory').get('scroll')) document.documentElement.scrollTop = STORAGE('memory').get('scroll');
    window.addEventListener('scroll', () => { STORAGE('memory').set('scroll', window.scrollY) });

    let getIDroom;
    let canvasHandleRun;

    function branchItemHandle() {
        const branchItems = X$$('.branch-item');
        !STORAGE('memory').get('branch') && branchItems[0].classList.add('active');
        if (STORAGE('memory').get('branch')) {
            branchItems.forEach(item => { 
                item.getAttribute('branch') === STORAGE('memory').get('branch') && item.classList.add('active');
            });
        };
        branchItemAnimate(branchItems);
        const color = document.createElement('div');
        color.classList.add('start');
        X$('.branch-item.active').appendChild(color);
        branchItemActive();
        // func children
        function branchItemAnimate(element) {
            element.forEach(item => {
                item.addEventListener('click', () => {    
                    if (X$('.branch-item.active')) { X$('.branch-item.active').classList.remove('active') };
                    if (X$('.branch-item .start')) { X$('.branch-item .start').remove() };
                    item.classList.add('active');
                    const color = document.createElement('div');
                    color.classList.add('start');
                    X$('.branch-item.active').appendChild(color);
                    branchItemActive();
                    STORAGE('memory').set('branch', X$('.branch-item.active').getAttribute('branch'));
                });
            });
        };
        function branchItemActive() {
            const activeElement = X$('.branch-item.active');
            const containerRightContent = X$('.container-right__content')
            containerRightContent.innerHTML = `
                <div class="text">
                    Chi nhánh ${activeElement.getAttribute('data-branch')}
                    <div class="start"></div>
                </div>
            `
            const containerRightContentText = X$('.container-right__content .text')
            const start = X$('.container-right__content .text .start')
            containerRightContentText.addEventListener('animationend', () => {
                start.classList.add('end')
            })
        };
    };

    function menuItemHandle() {
        const container = X$('.container-left__menu');
        const menuItems = container.querySelectorAll('.container-left__menu .item');
        const containerLeftContent = X$('.container-left-content');
        let lastHTML;
        effect(menuItems);
        showContentHandle();
        addBackgroundEff();

        // func children
        function effect(element) {
            element.forEach(item => {
                item.onclick = () => {
                    const lastItemActive = container.querySelector('.container-left__menu .item.active');
                    if (lastItemActive) { lastItemActive.classList.remove('active') };
                    const lastItemStart = container.querySelector('.container-left__menu .item .start');
                    if (lastItemStart) { lastItemStart.remove() };
                    item.classList.add('active');
                    showContentHandle();
                    addBackgroundEff();
                };
            });
        };
        function showContentHandle() {
            const activeEl = container.querySelector('.item.active');
            const attr = activeEl.getAttribute('type');
            switch (attr) {
                case 'room':
                    canvasHandleRun && clearInterval(canvasHandleRun);
                    if (containerLeftContent.innerHTML.trim()
                        && containerLeftContent.querySelector('.container-left-roomInfoContainer')) 
                        lastHTML = containerLeftContent.innerHTML;
                    if (!lastHTML) {
                        containerLeftContent.innerHTML = '';
                        return;
                    };

                    containerLeftContent.innerHTML = lastHTML;
                    runFuncRoom();

                    // func children
                    function runFuncRoom() {
                        const url = 'http://localhost:3000/roomList';
                        bookRoomHandle(url, getIDroom);
                        fancyboxHandle(X$('.container-left-roomInfoContainer__body-roomImg')
                            , '.container-left-roomInfoContainer__body-roomImg-wrapper-a'
                            , 'room-info');
                        removeUnnecessaryEl();
                    };
                    function removeUnnecessaryEl() {
                        const carouselBtnNext = X$(`.container-left-roomInfoContainer__body-roomImg-wrapper #mainCarousel 
                        .carousel__button.is-next`);
                        const carouselBtnPrev = X$(`.container-left-roomInfoContainer__body-roomImg-wrapper #mainCarousel 
                        .carousel__button.is-prev`);
                        const bookRoomUIiconWarning = X$(`.container-left-roomInfoContainer__body-bookRoomForm
                        .signIn-form__placeholderInput .icon-warning`);
                        const removeElarr = [];
                        removeElarr.push(carouselBtnNext);
                        removeElarr.push(carouselBtnPrev);
                        removeElarr.forEach(el => { el && el.remove() });
                        bookRoomUIiconWarning.classList.remove('active');
                    };
                break;
                case 'service':
                    canvasHandleRun && clearInterval(canvasHandleRun);
                    if (containerLeftContent.innerHTML.trim()
                        && containerLeftContent.querySelector('.container-left-roomInfoContainer'))
                        lastHTML = containerLeftContent.innerHTML;
                    containerLeftContent.innerHTML = serviceHTML();

                    runFuncService();
                    // func children
                    function runFuncService() {
                        const imgEls = X$$('.container-left-serviecCtn__body-restaurant-imgCtn');
                        zoomImg(imgEls);
                        textGradient();
                    };
                break;
                case 'endow':
                    canvasHandleRun && clearInterval(canvasHandleRun);
                    if (containerLeftContent.innerHTML.trim()
                        && containerLeftContent.querySelector('.container-left-roomInfoContainer'))
                        lastHTML = containerLeftContent.innerHTML;
                    containerLeftContent.innerHTML = endowHTML();

                    runFuncEndow();
                    // func children
                    function runFuncEndow() {
                        textGradient();
                    };
                break;
                case 'introduce':
                    canvasHandleRun && clearInterval(canvasHandleRun);
                    if (containerLeftContent.innerHTML.trim()
                        && containerLeftContent.querySelector('.container-left-roomInfoContainer'))
                        lastHTML = containerLeftContent.innerHTML;
                    containerLeftContent.innerHTML = introduceHTML();

                    runFuncIntroduce();
                    // func children
                    function runFuncIntroduce() {
                        textGradient();
                    };
                break;
                case 'contact':
                    canvasHandleRun && clearInterval(canvasHandleRun);
                    if (containerLeftContent.innerHTML.trim()
                        && containerLeftContent.querySelector('.container-left-roomInfoContainer'))
                        lastHTML = containerLeftContent.innerHTML;
                    containerLeftContent.innerHTML = contactHTML();

                    runFuncContact();
                    // func children
                    function runFuncContact() {
                        const form = X$('.contactCtn-body-container__col-form');
                        const btnSubmitForm = form.querySelector('.contactCtn-body-container__col-form-btnCtn .signIn-form__button-box .btn');
                        textGradient();
                        textareaEffect();
                        iconWarningAnimate(form, btnSubmitForm);
                    };
                    function textareaEffect() {
                        const textarea = X$('.contactCtn-body-container__col-form .signIn-form__box-input-textarea--border textarea');
                        const borderEl = textarea.closest('.signIn-form__box-input-textarea--border');
                        const height = textarea.offsetHeight + 'px';

                        textarea.onfocus = () => {
                            borderEl.classList.add('active');
                        };
                        textarea.onblur = () => {
                            borderEl.classList.remove('active');
                        };
                        textarea.oninput = () => {
                            textarea.style.height = height;
                            textarea.style.height = textarea.scrollHeight + 'px';
                        };
                    };
                break;
            };
            // func children
            function headerHTML(title) {
                return `
                <div class="container-left-content__header">
                    <div class="container-left-content__header-background">
                        <div class="container-left-content__header-background-titleContainer">
                            <span class="header-background-titleContainer__title">${title}</span>
                            <span class="header-background-titleContainer__textOverlay" aria-hidden="true"></span>
                        </div>
                        <canvas id="canv" width="32" height="32"></canvas>
                    </div>
                </div>
                `;
            };
            function serviceHTML() {
                return `
                <div class="container-left-serviecCtn">
                    ${headerHTML('Dịch vụ')}
                    <div class="container-left-serviecCtn__body">
                        <span class="container-left-serviecCtn__body-openingContent span">
                            Chúng tôi phục vụ thực đơn với các món ăn mang phong vị ẩm thực châu Á và Âu cùng với các thức uống 
                            tươi mát được chế biến từ bartender tài hoa của khách sạn. Các món ăn được chế biến từ nguồn nguyên 
                            liệu tươi ngon nhất của địa phương nhưng mang hương vị đặc trưng của các nước sẽ thỏa mãn các giác 
                            quan của bạn.
                        </span>
                        <span class="container-left-serviecCtn__body-title">
                            Các nhà hàng của chúng tôi
                        </span>
                        <div class="container-left-serviecCtn__body-restaurant">
                            <div class="container-left-serviecCtn__body-restaurant-name">
                                <span class="body-restaurant-name__text">THE LOBBY BAR&COFFEE</span>
                                <div class="body-restaurant-name__readMore">
                                    <span class="body-restaurant-name__readMore-text">ĐỌC THÊM</span>
                                </div>
                            </div>
                            <span class="container-left-serviecCtn__body-restaurant-decription span">
                                Khoác lên mình phong cách thiết kế mang hơi thở của kiến trúc Châu Âu hiện đại, The LOBBY 
                                bar&coffee với tông màu gỗ độc lạ, hứa hẹn sẽ mang đến sự ấm cúng và gần gũi cho Quý khách. 
                                Khi đến đây, Quý khách không những thưởng thức được những thức uống thơm ngon; khám phá được 
                                những công thức pha chế thức uống đặc biệt; mà không khí nơi đây, sẽ còn tạo cho Quý khách cảm 
                                giác như đang thật sự được tận hưởng những buổi chiều êm ả tại một góc Paris thu nhỏ.
                            </span>
                            <div class="container-left-serviecCtn__body-restaurant-btn signIn-form__button-box">
                                <div class="btn">XEM THỰC ĐƠN</div>
                                <i></i>
                            </div>
                            <a class="container-left-serviecCtn__body-restaurant-imgCtn" data-fancybox="gallery" 
                            href="../img/nha-hang-KIN/THE LOBBY BAR&COFFEE.png">
                                <img class="container-left-serviecCtn__body-restaurant-img" 
                                src="../img/nha-hang-KIN/THE LOBBY BAR&COFFEE.png" alt="">
                            </a>
                        </div>
                        <div class="container-left-serviecCtn__body-restaurant">
                            <div class="container-left-serviecCtn__body-restaurant-name">
                                <span class="body-restaurant-name__text">SOY</span>
                                <div class="body-restaurant-name__readMore">
                                    <span class="body-restaurant-name__readMore-text">ĐỌC THÊM</span>
                                </div>
                            </div>
                            <span class="container-left-serviecCtn__body-restaurant-decription span">
                                Chuyên phục vụ các món ngon mang âm vị Đà Lạt và những thực đơn độc đáo đến từ các quốc gia 
                                phương Đông – Nhà Hàng Salt & Soy được thiết kế với gam màu chủ đạo là nâu gỗ tinh tế, hứa 
                                hẹn không chỉ mang lại cảm giác thư giãn hơn cho thực khách mà còn mang lại những dư vị độc 
                                đáo khi Quý khách đến đây. Ngoài không gian ấm cúng và sang trọng luôn được đánh giá cao, 
                                thì chất lượng phục vụ, cũng như sự tinh tế trong các món ăn đặc sắc tại nhà hàng, luôn chinh 
                                phục được lòng của thực khách.
                            </span>
                            <div class="container-left-serviecCtn__body-restaurant-btn signIn-form__button-box">
                                <div class="btn">XEM THỰC ĐƠN</div>
                                <i></i>
                            </div>
                            <a class="container-left-serviecCtn__body-restaurant-imgCtn" data-fancybox="gallery" 
                            href="../img/nha-hang-KIN/SOY.png">
                                <img class="container-left-serviecCtn__body-restaurant-img" 
                                src="../img/nha-hang-KIN/SOY.png" alt="">
                            </a>
                        </div>
                        <div class="container-left-serviecCtn__body-restaurant">
                            <div class="container-left-serviecCtn__body-restaurant-name">
                                <span class="body-restaurant-name__text">TERRACE</span>
                                <div class="body-restaurant-name__readMore">
                                    <span class="body-restaurant-name__readMore-text">ĐỌC THÊM</span>
                                </div>
                            </div>
                            <span class="container-left-serviecCtn__body-restaurant-decription span">
                                Nhà hàng Terrace sở hữu không gian rộng thoáng tại tầng 5 của khách sạn Hôtel Colline. 
                                Với thiết kế theo phong cách Châu Âu thanh lịch, sang trọng trong khu vườn hoa hồng thơm 
                                ngát tạo nên một không gian riêng biệt đầy lý tưởng. Nhà hàng chuyên phục vụ bữa sáng tự 
                                chọn theo tiêu chuẩn quốc tế. Đến với Terrace ngoài việc thưởng thức các món ăn đặc sắc của 
                                khu vực Châu Âu, quý khách còn có thể ngắm nhìn trung tâm thành phố nhộn nhịp bên dưới. Một 
                                không gian mở sang trọng, rộng rãi rất phù hợp cho các sự kiện, sinh nhật hay họp mặt bạn bè, 
                                gia đình,..
                            </span>
                            <div class="container-left-serviecCtn__body-restaurant-btn signIn-form__button-box">
                                <div class="btn">XEM THỰC ĐƠN</div>
                                <i></i>
                            </div>
                            <a class="container-left-serviecCtn__body-restaurant-imgCtn" data-fancybox="gallery" 
                            href="../img/nha-hang-KIN/TERRACE.png">
                                <img class="container-left-serviecCtn__body-restaurant-img" 
                                src="../img/nha-hang-KIN/TERRACE.png" alt="">
                            </a>
                        </div>
                        <div class="container-left-serviecCtn__body-restaurant">
                            <div class="container-left-serviecCtn__body-restaurant-name">
                                <span class="body-restaurant-name__text">CENTRAL BAKERY</span>
                                <div class="body-restaurant-name__readMore">
                                    <span class="body-restaurant-name__readMore-text">ĐỌC THÊM</span>
                                </div>
                            </div>
                            <span class="container-left-serviecCtn__body-restaurant-decription span">
                                Quầy bánh - Hôtel Colline tại tầng 1 nằm dọc theo đường cầu thang xuống chợ Đà Lạt chuyên 
                                phục vụ các món bánh mì và bánh ngọt đẹp mắt và tươi mới mỗi ngày với giá cả phải chăng.
                            </span>
                            <div class="container-left-serviecCtn__body-restaurant-btn signIn-form__button-box">
                                <div class="btn">XEM THỰC ĐƠN</div>
                                <i></i>
                            </div>
                            <a class="container-left-serviecCtn__body-restaurant-imgCtn" data-fancybox="gallery" 
                            href="../img/nha-hang-KIN/CENTRAL BAKERY.png">
                                <img class="container-left-serviecCtn__body-restaurant-img" 
                                src="../img/nha-hang-KIN/CENTRAL BAKERY.png" alt="">
                            </a>
                        </div>
                        <div class="container-left-serviecCtn__body-restaurant">
                            <div class="container-left-serviecCtn__body-restaurant-name">
                                <span class="body-restaurant-name__text">PINT BEER</span>
                                <div class="body-restaurant-name__readMore">
                                    <span class="body-restaurant-name__readMore-text">ĐỌC THÊM</span>
                                </div>
                            </div>
                            <span class="container-left-serviecCtn__body-restaurant-decription span">
                                Theo phong cách Metropolitan, PINT BEER sở hữu một không gian đơn giản và tinh tế. Cùng với 
                                các loại bia thủ công, bia ngoại nhập được lựa chọn kĩ lưỡng sẽ giúp bạn có một buổi tối tuyệt 
                                vời.
                            </span>
                            <div class="container-left-serviecCtn__body-restaurant-btn signIn-form__button-box">
                                <div class="btn">XEM THỰC ĐƠN</div>
                                <i></i>
                            </div>
                            <a class="container-left-serviecCtn__body-restaurant-imgCtn" data-fancybox="gallery" 
                            href="../img/nha-hang-KIN/PINT BEER.png">
                                <img class="container-left-serviecCtn__body-restaurant-img" 
                                src="../img/nha-hang-KIN/PINT BEER.png" alt="">
                            </a>
                        </div>
                    </div>
                </div>
                `;
            };
            function endowHTML() {
                return `
                <div class="endowCtn">
                    ${headerHTML('ưu đãi')}
                    <div class="endowCtn-body">
                        <div class="endowCtn-body-searchCtn--background">
                            <div class="endowCtn-body-searchCtn">
                                <input type="text" class="endowCtn-body-searchCtn__input" placeholder="TÌM KIẾM">
                                <i class="fa-regular fa-magnifying-glass iconSearch"></i>
                            </div>
                        </div>
                        <div class="endowCtn-body-cardCtn">
                            <div class="endowCtn-body-card">
                                <div class="endowCtn-body-card__top">
                                    <img src="../img/uu-dai/img1.png" alt="" class="endowCtn-body-card__top-img">
                                </div>
                                <div class="endowCtn-body-card__bot--border">
                                    <div class="endowCtn-body-card__bot">
                                        <span class="endowCtn-body-card__bot-title">
                                            FESTIVAL HOA ĐÀ LẠT 2022 - 2023
                                        </span>
                                        <span class="endowCtn-body-card__bot-content span">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore consectetur ipsum 
                                            consequuntur quidem necessitatibus quaerat in, sed molestias. Unde maxime, eius minima 
                                            rerum aliquid dolore nesciunt nostrum beatae ullam modi.
                                        </span>
                                        <div class="endowCtn-body-card__bot-date">
                                            <i class="fa-regular fa-timer timeIcon"></i>
                                            12-11-2022
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="endowCtn-body-card">
                                <div class="endowCtn-body-card__top">
                                    <img src="../img/uu-dai/img2.png" alt="" class="endowCtn-body-card__top-img">
                                </div>
                                <div class="endowCtn-body-card__bot--border">
                                    <div class="endowCtn-body-card__bot">
                                        <span class="endowCtn-body-card__bot-title">
                                            OUR SPECIAL PACKAGE OFFER
                                        </span>
                                        <span class="endowCtn-body-card__bot-content">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore consectetur ipsum 
                                            consequuntur quidem necessitatibus quaerat in, sed molestias. Unde maxime, eius minima 
                                            rerum aliquid dolore nesciunt nostrum beatae ullam modi.
                                        </span>
                                        <div class="endowCtn-body-card__bot-date">
                                            <i class="fa-regular fa-timer timeIcon"></i>
                                            26-08-2022
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="endowCtn-body-card">
                                <div class="endowCtn-body-card__top">
                                    <img src="../img/uu-dai/img3.png" alt="" class="endowCtn-body-card__top-img">
                                </div>
                                <div class="endowCtn-body-card__bot--border">
                                    <div class="endowCtn-body-card__bot">
                                        <span class="endowCtn-body-card__bot-title">
                                            HÔTEL COLLINE & KISS WEDDING
                                        </span>
                                        <span class="endowCtn-body-card__bot-content">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore consectetur ipsum 
                                            consequuntur quidem necessitatibus quaerat in, sed molestias. Unde maxime, eius minima 
                                            rerum aliquid dolore nesciunt nostrum beatae ullam modi.
                                        </span>
                                        <div class="endowCtn-body-card__bot-date">
                                            <i class="fa-regular fa-timer timeIcon"></i>
                                            23-08-2022
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="endowCtn-body-card">
                                <div class="endowCtn-body-card__top">
                                    <img src="../img/uu-dai/img4.png" alt="" class="endowCtn-body-card__top-img">
                                </div>
                                <div class="endowCtn-body-card__bot--border">
                                    <div class="endowCtn-body-card__bot">
                                        <span class="endowCtn-body-card__bot-title">
                                            PENTHOUSE TRÊN ĐÀ LẠT
                                        </span>
                                        <span class="endowCtn-body-card__bot-content">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore consectetur ipsum 
                                            consequuntur quidem necessitatibus quaerat in, sed molestias. Unde maxime, eius minima 
                                            rerum aliquid dolore nesciunt nostrum beatae ullam modi.
                                        </span>
                                        <div class="endowCtn-body-card__bot-date">
                                            <i class="fa-regular fa-timer timeIcon"></i>
                                            19-05-2022
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="endowCtn-body-widget--border">
                            <div class="endowCtn-body-widget">
                                <span class="endowCtn-body-widget__title">THẺ VIP KIN</span>
                                <div class="endowCtn-body-widget__content">
                                    <div class="endowCtn-body-widget__content-img">
                                        <img src="../img/uu-dai/vip-card1.png" alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            };
            function introduceHTML() {
                return `
                <div class="introduceCtn">
                    ${headerHTML('về chúng tôi')}
                    <div class="introduceCtn-body">
                        <span class="introduceCtn-body-title">Giới thiệu khách sạn KIN</span>
                        <div class="introduceCtn-body-contentCtn">
                            <span class="introduceCtn-body-contentCtn__content span">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim sed possimus provident repudiandae 
                                fugit voluptate rerum iure, iste aliquid consequuntur repellendus perspiciatis aspernatur soluta 
                                quam! Voluptatem rem dicta recusandae laudantium? 
                            </span>
                            <span class="introduceCtn-body-contentCtn__content span">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim sed possimus provident repudiandae 
                                fugit voluptate rerum iure, iste aliquid consequuntur repellendus perspiciatis aspernatur soluta 
                                quam! Voluptatem rem dicta recusandae laudantium? 
                            </span>
                        </div>
                        <div class="introduceCtn-body-hotelInfo">
                            <div class="introduceCtn-body-hotelInfo__border">
                                <div class="introduceCtn-body-hotelInfo__backgorund">
                                    <div class="introduceCtn-body-hotelInfo__header">
                                        <div class="introduceCtn-body-hotelInfo__header-logo">
                                            <img src="../img/logo.png" alt="" class="introduceCtn-body-hotelInfo__header-logo-img">
                                        </div>
                                        <div class="introduceCtn-body-hotelInfo__header-icon">
                                            <i class="fa-sharp fa-solid fa-star iconStar"></i>
                                            <i class="fa-sharp fa-solid fa-star iconStar"></i>
                                            <i class="fa-sharp fa-solid fa-star iconStar"></i>
                                            <i class="fa-sharp fa-solid fa-star iconStar"></i>
                                            <i class="fa-sharp fa-solid fa-star iconStar"></i>
                                        </div>
                                    </div>
                                    <h2 class="introduceCtn-body-hotelInfo__title">
                                        KIN - Khách Sạn Việt Nam
                                    </h2>
                                    <span class="introduceCtn-body-hotelInfo__content span">
                                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque, laborum voluptatum. 
                                        Praesentium minus pariatur accusamus ipsa, ratione odit, ipsum, illo distinctio necessitatibus 
                                        suscipit velit sit sapiente corrupti adipisci totam minima!
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="introduceCtn-body-hotelInfoDetails">
                            <h2 class="introduceCtn-body-hotelInfoDetails__title">
                                VỊ TRÍ
                            </h2>
                            <div class="introduceCtn-body-hotelInfoDetails__map">
                                <div class="introduceCtn-body-hotelInfoDetails__map--background">
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.680220476582!2d106.589187!3d10.759109899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752c513d25dae9%3A0x2ee3f8c2a7414d64!2zODUsIDM4IEjhu5MgVsSDbiBMb25nLCBUw6JuIFThuqFvLCBCw6xuaCBUw6JuLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1672551478346!5m2!1svi!2s" 
                                    width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" 
                                    referrerpolicy="no-referrer-when-downgrade"></iframe>
                                </div>
                            </div>
                            <div class="introduceCtn-body-hotelInfoDetails__contentCtn">
                                <span class="introduceCtn-body-hotelInfoDetails__contentCtn-content span">
                                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa vel enim repellat commodi 
                                    necessitatibus temporibus aliquid cum tempora adipisci placeat odio incidunt autem officia 
                                    beatae, est architecto consequatur eaque corrupti!
                                </span>
                            </div>
                            
                            <h2 class="introduceCtn-body-hotelInfoDetails__title">
                                TẦM NHÌN & SỨ MỆNH
                            </h2>
                            <div class="introduceCtn-body-hotelInfoDetails__contentCtn">
                                <div class="introduceCtn-body-hotelInfoDetails__contentCtn-title">
                                    Tầm nhìn:
                                    <span class="introduceCtn-body-hotelInfoDetails__contentCtn-title-content span">
                                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa vel enim repellat commodi 
                                        necessitatibus temporibus aliquid cum tempora adipisci placeat odio incidunt autem officia 
                                        beatae, est architecto consequatur eaque corrupti!
                                    </span>
                                </div>
                                <div class="introduceCtn-body-hotelInfoDetails__contentCtn-title">
                                    Sứ mệnh:
                                    <span class="introduceCtn-body-hotelInfoDetails__contentCtn-title-content span">
                                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa vel enim repellat commodi 
                                        necessitatibus temporibus aliquid cum tempora adipisci placeat odio incidunt autem officia 
                                        beatae, est architecto consequatur eaque corrupti!
                                    </span>
                                </div>
                            </div>

                            <h2 class="introduceCtn-body-hotelInfoDetails__title">
                                "TRÁI TIM CỦA THÉP"
                            </h2>
                            <div class="introduceCtn-body-hotelInfoDetails__contentCtn">
                                <span class="introduceCtn-body-hotelInfoDetails__contentCtn-content span">
                                    "Việc gì người ta làm được thì mình cũng làm được" luôn là tâm niệm hành động của nhân vật 
                                    chính trong hồi kí "Trái tim của Thép" để từ đó giúp bà vượt qua nhiều trở lực. 
                                </span>
                                <span class="introduceCtn-body-hotelInfoDetails__contentCtn-content span">
                                    Trái tim của thép là tập hồi ký ghi chép về cuộc đời nhân vật được quen gọi là 
                                    "cô Liên" - Trần Thị Liên, người tạo lập nên doanh nghiệp thép Ngọc Biển được bạn bè 
                                    ngành thép phía Nam biết tiếng và dành cho nhiều tình cảm quý mến. Nếu nói cuốn hồi ký 
                                    này là một tập nhật ký gia đình, cũng không sai. Với gần 250 trang hồi ký, trái với hình 
                                    ảnh nữ doanh nhân thành đạt thường thấy, mà ở đây qua tác phẩm, cô Liên hiện lên rất 
                                    người, rất đời. 
                                </span>
                                <span class="introduceCtn-body-hotelInfoDetails__contentCtn-content span">
                                    Một trong những ấn tượng xuyên suốt với độc giả qua tập hồi ký là câu nói quen thuộc, 
                                    thể hiện ý chí, nghị lực vươn lên không ngừng của người phụ nữ này:"Việc gì người ta 
                                    làm được thì mình cũng làm được". Qua Trái tim của Thép là hình ảnh của một nữ doanh 
                                    nhân thành đạt ngoài xã hội, trên thương trường. Những nơi gia đình, là sự giản dị, chân 
                                    chất và đầy tình yêu thương của người mẹ, người vợ với tổ ấm của mình. 
                                </span>
                                <div class="introduceCtn-body-hotelInfoDetails__contentCtn-img">
                                    <img src="../img/trai-tim-cua-thep.png" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            };
            function contactHTML() {
                return `
                <div class="contactCtn">
                    <div class="contactCtn-header">
                        <div class="container-left-content__header">
                            <div class="container-left-content__header-background">
                                <div class="container-left-content__header-background-titleContainer">
                                    <span class="header-background-titleContainer__title">Liên Hệ</span>
                                    <span class="header-background-titleContainer__textOverlay" aria-hidden="true"></span>
                                </div>
                                <canvas id="canv" width="32" height="32"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="contactCtn-body">
                        <div class="contactCtn-body-map">
                            <div class="contactCtn-body-map--background">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.680220476582!2d106.589187!3d10.759109899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752c513d25dae9%3A0x2ee3f8c2a7414d64!2zODUsIDM4IEjhu5MgVsSDbiBMb25nLCBUw6JuIFThuqFvLCBCw6xuaCBUw6JuLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1672551478346!5m2!1svi!2s" 
                                width="100%" height="100%" style="border:0;" allowfullscreen loading="lazy"
                                aria-hidden="false" tabindex="0"></iframe>
                            </div>
                        </div>
                        <div class="contactCtn-body-container">
                            <div class="contactCtn-body-container__col">
                                <div class="contactCtn-body-container__col-titleCtn">
                                    <span class="contactCtn-body-container__col-titleCtn-title">
                                        Liên hệ
                                    </span>
                                    <span class="contactCtn-body-container__col-titleCtn-subtitle">
                                        Hãy để chúng tôi liên hệ cho bạn!
                                    </span>
                                </div>

                                <span class="contactCtn-body-container__col-content span">
                                    Với mong muốn đem lại dịch vụ tốt nhất cho khách hàng. Chúng tôi luôn mong chờ những góp 
                                    ý chân thành từ các bạn. Hãy gửi lời nhắn cho chúng tôi nếu bạn có góp ý hoặc bất cứ nhu 
                                    cầu hợp tác nào!
                                </span>

                                <form class="contactCtn-body-container__col-form">
                                    <div class="signIn-form__box-input">
                                        <input type="text" placeholder=" ">
                                        <div class="signIn-form__placeholderInput">
                                            <span class="signIn-form__placeholderInput-text">TÊN CỦA BẠN</span>
                                            <i class="fa-solid fa-triangle-exclamation icon-warning"></i>
                                        </div>
                                        <div class="signIn-form__line"></div>
                                    </div>
                                    <div class="signIn-form__box-input">
                                        <input type="email" placeholder=" ">
                                        <div class="signIn-form__placeholderInput">
                                            <span class="signIn-form__placeholderInput-text">ĐỊA CHỈ EMAIL</span>
                                            <i class="fa-solid fa-triangle-exclamation icon-warning"></i>
                                        </div>
                                        <div class="signIn-form__line"></div>
                                    </div>
                                    <div class="signIn-form__box-input">
                                        <input type="number" placeholder=" ">
                                        <div class="signIn-form__placeholderInput">
                                            <span class="signIn-form__placeholderInput-text">SỐ ĐIỆN THOẠI</span>
                                            <i class="fa-solid fa-triangle-exclamation icon-warning"></i>
                                        </div>
                                        <div class="signIn-form__line"></div>
                                    </div>
                                    <div class="signIn-form__box-input">
                                        <div class="signIn-form__box-input-textarea--border">
                                            <textarea placeholder=" " name="" id="" cols="30" rows="10"></textarea>
                                            <div class="signIn-form__placeholderInput">
                                                <span class="signIn-form__placeholderInput-text">LỜI NHẮN</span>
                                                <i class="fa-solid fa-triangle-exclamation icon-warning"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="contactCtn-body-container__col-form-btnCtn">
                                        <div class="signIn-form__button-box">
                                            <div class="btn">Gửi yêu cầu</div>
                                            <i></i>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="contactCtn-body-container__col">
                                <div class="contactCtn-body-container__col-titleCtn">
                                    <span class="contactCtn-body-container__col-titleCtn-title">
                                        Thông tin
                                    </span>
                                    <span class="contactCtn-body-container__col-titleCtn-subtitle">
                                        Liên hệ ngay
                                    </span> 
                                </div>

                                <div class="contactCtn-body-container__col-detailCtn">
                                    <div class="contactCtn-body-container__col-detailCtn-item">
                                        <i class="fa-duotone fa-location-dot icon"></i>
                                        <span class="col-detailCtn-item__text">
                                            58/38 Ho Van Long Street, Tan Tao Ward, Binh Tan District, Ho Chi Minh City.
                                        </span>
                                    </div>
                                    <div class="contactCtn-body-container__col-detailCtn-item">
                                        <i class="fa-duotone fa-phone icon"></i>
                                        <span class="col-detailCtn-item__text">
                                            +84 933 069 587
                                        </span>
                                    </div>
                                    <div class="contactCtn-body-container__col-detailCtn-item">
                                        <i class="fa-duotone fa-mailbox icon"></i>
                                        <span class="col-detailCtn-item__text">
                                            khaihuynh450@gmail.com
                                        </span>
                                    </div>
                                </div>

                                <div class="contactCtn-body-container__col-contactCtn">
                                    <a target="_blank" href="https://www.facebook.com/profile.php?id=100017221278677">
                                        <span class="contactCtn-body-container__col-contactCtn-title">Facebook</span>
                                        <i style="--color: rgb(59 89 152)" class="fa fa-facebook-f icon"></i>
                                    </a>
                                    <a target="_blank" href="https://www.facebook.com/profile.php?id=100017221278677">
                                        <span class="contactCtn-body-container__col-contactCtn-title">Twitter</span>
                                        <i style="--color: rgb(64 153 255)" class="fa-brands fa-twitter icon"></i>
                                    </a>
                                    <a target="_blank" href="https://www.facebook.com/profile.php?id=100017221278677">
                                        <span class="contactCtn-body-container__col-contactCtn-title">Youtube</span>
                                        <i style="--color: rgb(187 0 0)" class="fa fa-youtube icon"></i>
                                    </a>
                                    <a target="_blank" href="https://www.facebook.com/profile.php?id=100017221278677">
                                        <span class="contactCtn-body-container__col-contactCtn-title">Tripadvisor</span>
                                        <i style="--color: rgb(0 166 128) " class="fa fa-tripadvisor icon"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            };
        };
    };
    function addBackgroundEff() {
        const container = X$('.container-left__menu');
        const background = document.createElement('div');
        background.classList.add('start');
        container.querySelector('.container-left__menu .item.active').appendChild(background);
    };

    function adminSignInHandle() {
        const containerLeftControl = X$('.container-left__control');
        const btnAdminSignIn = containerLeftControl.firstElementChild;
        const starting_1 = btnAdminSignIn.children[2];
        innerHTMLadminSignInForm(starting_1, btnAdminSignIn, containerLeftControl);
        // func children
        function innerHTMLadminSignInForm(element, btn, parentElement) {
            btn.onclick = () => {
                element.style.width = '100%';
                parentElement.classList.add('active');
                element.addEventListener('transitionend', () => {
                    parentElement.innerHTML = `
                    <form class="signIn-form">
                        <div class="signIn-form__box-icon-close">
                            <i class="fa-solid fa-rectangle-xmark icon-close"></i>
                            <i class="fa-solid fa-rectangle-xmark fa-rectangle-xmark-shadow"></i>
                        </div>
                        <div class="signIn-form__textContent">Admin Đăng Nhập</div>
                        <div class="signIn-form__box-input">
                            <input type="text" id="email" placeholder=" ">
                            <div class="signIn-form__placeholderInput">
                                Your email
                                <i class="fa-solid fa-triangle-exclamation icon-warning"></i>
                            </div>
                            <div class="signIn-form__line"></div>
                        </div>
                        <div class="signIn-form__box-input">
                            <input type="password" id="password" placeholder=" ">
                            <div class="signIn-form__placeholderInput">
                                Your password
                                <i class="fa-solid fa-triangle-exclamation icon-warning"></i>
                            </div>
                            <div class="signIn-form__line"></div>
                            <i onclick="typePassword(this)" class="fa-solid fa-eye eye"></i>
                        </div>
                        <div class="signIn-form__forgot-password">
                            <div class="text">Quên mật khẩu ?</div>
                        </div>
                        <div class="signIn-form__notification">
                            <span class="password">Sai tên tài khoản hoặc mật khẩu</span>
                        </div>
                        <div class="signIn-form__button-box">
                            <div class="btn">Đăng nhập</div>
                            <i></i>
                        </div>
                            <div style="--delay: 0" class="starting-1"></div>
                            <div style="--delay: 0.1s" class="starting-2"></div>
                            <div style="--delay: 0.2s" class="starting-3"></div>
                            <div style="--delay: 0.3s" class="starting-4"></div>
                    </form>
                    `;
                    const signInForm = X$('.signIn-form');
                    const iconClose = X$('.signIn-form .icon-close');
                    const btn = X$('.signIn-form .signIn-form__button-box .btn');
                    innerHTMLbtnAdminSignIn(iconClose, parentElement, signInForm);
                    submitFormHandle(signInForm, btn , true);
                    forgotPasswordForm(signInForm);
                });
            };
        };
        function innerHTMLbtnAdminSignIn(element, parentElement, form) {
            element.onclick = () => {
                for (let i = 0; i < 4; i++) {
                    const starting = document.createElement('div');
                    starting.classList.add(`starting-${i + 5}`);
                    starting.style.animationDelay = i / 10 + 's';
                    form.appendChild(starting);
                }
                const starting_8 = form.children[13];
                starting_8.addEventListener('animationend', () => {
                    parentElement.classList.remove('active');
                    parentElement.innerHTML = `
                        <div class="container-left__control__textContent">
                            <div class="after"></div>
                            <div class="before"></div>
                            Admin Đăng Nhập
                            <div class="starting-1"></div>
                            <div class="starting-2"></div>
                        </div>
                        `;
                    adminSignInHandle();
                });
            };
        };
        function submitFormHandle(element, btn, action) {
            const inputs = element.querySelectorAll('input');
            const notifi = element.querySelector('.signIn-form__notification span');
            iconWarningAnimate(element, btn);
            btn.onclick = () => {
                const array = [];
                const requiredInfoCounter = 2
                inputs.forEach(input => {
                    if(input.value.trim() !== '') array.push(input.value.trim());
                    input.onfocus = () => { notifi.classList.remove('active') };
                });
                if (!action) return;
                if (array.length < requiredInfoCounter) return;
                const datas = {
                    userName: array[0],
                    password: array[1]
                };
                getDataUserToLogIn(datas, notifi);
            };
        };
        function getDataUserToLogIn(datas, notifi) {
            const url1 = "http://localhost:3000/adminAcount";
            const url2 = "http://localhost:3000/account";
            const getData = async () => {
                loader();
                const res1 = await getTodo(url1);
                const res2 = await getTodo(url2);
                const check1 = res1.find(account => {
                    return datas.userName.toLowerCase() === account.userName.toLowerCase()
                        && datas.password === account.password;
                });
                const check2 = res2.find(account => {
                    return datas.userName.toLowerCase() === account.userName.toLowerCase()
                        && datas.password === account.password;
                });
                if (!check1 && !check2) {
                    notifi.classList.add('active');
                    loader('hide');
                    return;
                };
                let id;
                let url;
                if (check1) {
                    id = check1.id;
                    url = url1;
                };
                if (check2) {
                    id = check2.id;
                    url = url2;
                };
                fetch(url + '/' + id, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ online: true })
                }).then(() => { 
                    loader('hide');
                    window.open("file:///E:/C%C3%A0y_FrontEnd/Do_An_Tot_Nghiep/Project/adminPage/index.html", "_blank");
                })
            };
            getData();
        };

        function forgotPasswordForm(element) {
            const btn = element.querySelector('.signIn-form__forgot-password .text');
            btn.onclick = () => {
                const form = document.createElement('form');
                form.className = 'signIn-form create-form';
                createForm(form, "forgot-password")
                document.body.appendChild(form);
                const btnSubmit = form.querySelector('.create-form__btn-submit');
                const btnCancel = form.querySelector('.create-form__btn-cancel');
                btnCancel.onclick = () => {
                    form.remove();
                    overlay('hide');
                    if (code) code = undefined;
                };
                submitFormHandle(form, btnSubmit);
                confirmChangePassword(form);
                overlay();
            };
        };
        let code;
        function confirmChangePassword(element) {
            const btnSubmit = element.querySelector('.create-form__btn-submit');
            const input = element.querySelectorAll('.signIn-form__box-input input');
            const codeInput = input[1];
            const email = input[0];
            const icon = email.nextElementSibling.querySelector('i');
            const btnGetCode = element.querySelector('.signIn-form__verification-code .signIn-form__button-box .btn');
            const notifi = element.querySelectorAll('.signIn-form__notification span');
            const codeNotMatch = notifi[0];
            const accountInvalid = notifi[1];
            const subject = 'KIN - khách sạn Việt Nam';
            btnGetCode.onclick = () => { btnGetCodeHandle(btnGetCode, email, icon, subject) };
            btnSubmit.addEventListener('click', () => { btnSubmitHandle(element, input, notifi) });
            email.addEventListener('focus', () => {
                accountInvalid.classList.remove('active');
                icon.classList.remove('active');
            });
            codeInput.addEventListener('focus', () => { codeNotMatch.classList.remove('active') });
        };
        function btnGetCodeHandle(...params) {
            const [ btnGetCode, email, icon, subject ] = params;
            if (email.value.trim() === '') {
                icon.classList.add('active');
                const animate = icon.animate(
                    [
                        { marginLeft: '6px' },
                        { marginLeft: '12px' },
                        { marginLeft: '6px' },
                        { marginLeft: '12px' },
                        { marginLeft: '6px' },
                    ],
                    { duration: 600, easing: 'ease' }
                );
                animate.play();
                return;
            };
            code = randomVerificationCode();
            console.log("email nhận code là: ", code);  
            const message = `
                    <div style="color: black;">
                        <h1 style="text-align: center;">KIN - khách sạn Việt Nam</h1>
                        <span style="display: flex;">
                            <span style="margin: auto;">
                                <p style="display: block;">Xin chào ${email.value.trim()},</p>
                                <p style="display: block;">đây là mã xác minh của bạn:</p>
                                <p style="display: block; 
                                font-size: 30px; 
                                font-weight: bold;
                                text-align: center;
                                background: rgba(0, 0, 0, 0.2);
                                padding: 3px 3px">${code}</p>
                            </span>
                        </span>
                    </div>
                    `;
            sendEmail(email.value.trim(), subject, message);
            btnGetCode.innerHTML = `
                <div class="circular">
                    <div class="inner"></div>
                    <div class="outer"></div>
                    <div class="circle">
                        <div class="bar left">
                            <div class="progress"></div>
                        </div>
                        <div class="bar right">
                            <div class="progress"></div>
                        </div>
                    </div>
                </div>
                <div style="user-select: none;" class="text">20</div>
            `;
            circle(params);
        };
        function btnSubmitHandle(...params) {
            console.log('nhận code là:', code)
            const [ element, input, notifi ] = params
            const email = input[0];
            const codeInput = input[1];
            const codeNotMatch = notifi[0];
            const accountInvalid = notifi[1];
            const array = [];
            const requiredInfoCounter = 2;
            input.forEach(item => { if (item.value.trim() !== '') array.push(item.value.trim()) });
            codeInput.value.trim() !== code 
            && codeInput.value.trim() !== '' 
            && email.value.trim() !== ''
            && codeNotMatch.classList.add('active');
            if (array.length < requiredInfoCounter || codeNotMatch.classList.contains('active')) return;
            code = undefined;
            loader();
            const getData = async () => {
                const url1 = "http://localhost:3000/adminAcount";
                const url2 = "http://localhost:3000/account";
                const res1 = await getTodo(url1);
                const res2 = await getTodo(url2);
                const check1 = res1.find(item => {
                    return item.userName.toLowerCase() === email.value.trim().toLowerCase();
                });
                const check2 = res2.find(item => {
                    return item.userName.toLowerCase() === email.value.trim().toLowerCase();
                });
                if (!check1 && !check2) {
                    loader('hide');
                    accountInvalid.classList.add('active');
                    return;
                };
                let id;
                let url;
                if (check1) {
                    id = check1.id;
                    url = url1;
                };
                if (check2) {
                    id = check2.id;
                    url = url2;
                };
                element.remove();
                const form = document.createElement('form');
                form.className = 'signIn-form create-form';
                createForm(form, "create-new-password");
                document.body.appendChild(form);
                loader('hide');
                const btnSubmit = form.querySelector('.create-form__btn-submit');
                const btnCancel = form.querySelector('.create-form__btn-cancel');
                btnCancel.onclick = () => {
                    form.remove();
                    overlay('hide');
                };
                submitFormHandle(form, btnSubmit);
                const notifi = form.querySelector('.signIn-form__notification span');
                const inputs = form.querySelectorAll('.signIn-form__box-input input');
                const password = inputs[0];
                const confirmPassword = inputs[1];
                btnSubmit.addEventListener('click', () => {
                    const passwordValue = password.value.trim();
                    const confirmPasswordValue = confirmPassword.value.trim();
                    if (passwordValue === '' || confirmPasswordValue === '') return;
                    if (passwordValue === confirmPasswordValue) {
                        loader();
                        usingFetch("PATCH", url + "/" + id, { password: passwordValue })
                            .then(removeForm)
                        function removeForm() {
                            btnCancel.click();
                            loader("hide");
                        };
                        return;
                    };
                    passwordValue !== confirmPasswordValue && notifi.classList.add('active');
                });
            };
            getData();
        };
        function createForm(element, form) {
            element.innerHTML = `
                <div class="signIn-form__textContent">${form === "forgor-password"
                && "Xác thực tài khoản"
                || "Tạo mật khẩu mới"}
                </div>
                ${form === "forgot-password" && `    
                    <div class="signIn-form__box-input">
                        <input type="text" id="email" placeholder=" ">
                        <div class="signIn-form__placeholderInput">
                            Your email
                            <i class="fa-solid fa-triangle-exclamation icon-warning"></i>
                        </div>
                        <div class="signIn-form__line"></div>
                    </div>
                    <div class="signIn-form__verification-code">
                        <div class="text">Nhập mã xác minh được gửi về email</div>
                        <div class="signIn-form__button-box">
                            <div class="btn">Nhận mã</div>
                            <i></i>
                        </div>
                    </div>
                    <div class="signIn-form__box-input">
                        <input type="text" placeholder=" ">
                        <div class="signIn-form__placeholderInput">
                            Verification code
                            <i class="fa-solid fa-triangle-exclamation icon-warning"></i>
                        </div>
                        <div class="signIn-form__line"></div>
                    </div>`
                    || `
                    <div class="signIn-form__box-input">
                        <input type="password" id="password" placeholder=" ">
                        <div class="signIn-form__placeholderInput">
                            Your password
                            <i class="fa-solid fa-triangle-exclamation icon-warning"></i>
                        </div>
                        <div class="signIn-form__line"></div>
                        <i onclick="typePassword(this)" class="fa-solid fa-eye eye"></i>
                    </div>
                    <div class="signIn-form__box-input">
                        <input type="password" id="password" placeholder=" ">
                        <div class="signIn-form__placeholderInput">
                            Your password
                            <i class="fa-solid fa-triangle-exclamation icon-warning"></i>
                        </div>
                        <div class="signIn-form__line"></div>
                        <i onclick="typePassword(this)" class="fa-solid fa-eye eye"></i>
                    </div>
                    `}
                <div class="signIn-form__notification">
                    ${form === "forgot-password" 
                    && `<span>Mã xác minh không đúng</span>
                        <span>Tài khoản không tồn tại</span>`
                    || `<span>Mật khẩu không trùng khớp</span>`}
                </div>
                <div class="create-form__btn-box">
                    <div style="--background: rgb(226, 147, 0); --active: rgb(174, 113, 0);" 
                        class="create-form__btn-cancel btn">Hủy</div>
                    <div style="--background: var(--mainColor-); 
                        --active: linear-gradient(102.1deg, rgb(69, 198, 117) 8.7%, rgb(12, 111, 114) 88.1%);"
                        class="create-form__btn-submit btn">
                        <span>Xác nhận</span>
                        <i></i>
                    </div>
                </div>
            `;
        };
        function sendEmail(email, subject, message) {
            Email.send({
                Host : "smtp.elasticemail.com",
                Username: "khaihuynh450@gmail.com",
                Password: "AC4D1EB8E95CDB266DB32FD99B8ACFC2FFD0",
                // SecureToken: "cc6eb7cf-4366-407c-9d85-7d3e752371ca",
                To: email,
                From: "khaihuynh450@gmail.com",
                Subject: subject,
                Body: message
            })
            .then(message => alert(message))
        };
    };

    async function getDataRoomToHandle(clearEl) {
        const url = 'http://localhost:3000/roomList';
        const res = await getTodo(url); 
        let isBranchBtnClick = false;
        renderByBranch(res);
        // func children
        function renderByBranch(res) {
            const branchItems = X$$('.branch-item');
            const branchItemActive = X$('.branch-item.active');
            if (!branchItemActive) return;
            const branch = branchItemActive.getAttribute('branch');
            filterArray(branch);
            branchItems.forEach(branchItem => {
                branchItem.onclick = () => {
                    isBranchBtnClick = true;
                    const branchItemActive = X$('.branch-item.active');
                    const branch = branchItemActive.getAttribute('branch');
                    body.scrollIntoView({behavior: "smooth", block: "start"});
                    filterArray(branch);
                };
            });
            // func children
            function filterArray(branch) {
                const data = res.filter(r => r.branch === branch && !r.isNotRoom);
                renderByFilter(data)
            };
            // clear html el
            if (clearEl === 'clear-roomInfoContainer') {
                const roomInfoContainer = X$('.container-left-roomInfoContainer');
                roomInfoContainer.innerHTML = '';
            };
        };
        function renderByFilter(res) {
            const container = X$('.container-right-filter__selectContainer');
            const els = container.querySelectorAll(`.select-ctn-optionCtn__option`);
            filter();
            els.forEach(el => { el.onclick = filter });
            // func children
            function filter() {
                const activeEl = container.querySelector(`.select-ctn-optionCtn__option.active`);
                const attr = activeEl.getAttribute('type');
                let data;
                if (attr === 'all') {
                    data = res;
                } else {
                    data = res.filter(r => r.roomType === attr);
                }
                renderByCheckBox(data);
            };
        };
        function renderByCheckBox(res) {
            const checkBoxEl = X$('.checkBoxCtn');
            filter();
            checkBoxEl.onclick = filter;

            // func children
            function filter() {
                const backgroundEl = checkBoxEl.querySelector('.checkBoxCtn-checkBox-background');
                let isChecked = false;
                if (backgroundEl.classList.contains('active')) isChecked = true;
                let data;
                isChecked ? data = res.filter(r => r.status === 'Đang trống!')
                : data = res;
                renderHTMLroomItems(data, isBranchBtnClick);
            };
        };
    };
    function renderHTMLroomItems(res, isBranchBtnClick) {
        const containerRightMain = X$('.container-right-main');
        const sort = sortLibary(res, 'number', 'incr', 'amount');
        const htmls = sort.map(r => {
            const { id, avatar, roomName, amount, status } = r;
            return `
            <div class="col l-6">
                <div ID="${id && id || ''}" class="room-container ${status !== 'Đang trống!' && 'pointerNone' || ''}">
                    <div class="room-container__img ${status !== 'Đang trống!' && 'opacity' || ''}">
                        <div class="lineWhite"></div>
                        <img src="${avatar}" alt="">
                        <div class="room-container__img-border"></div>
                    </div>

                    <div class="room-container__info">
                        <span class="room-container__infoRoomName">${roomName}</span>
                        <span class="room-container__info-amountGuest">Phòng ${amount} người</span>
                    </div>

                    <div class="room-container__book-room-btn">
                        <div class="background ${status !== 'Đang trống!' && 'start' || ''}"></div>
                        <i></i>
                        <div class="text">${status !== 'Đang trống!' && 'Đã được đặt' || 'Đặt phòng ngay'}</div>
                    </div>
                </div>
            </div>
        `}).join('\n');
        containerRightMain.innerHTML = `
            <div class="row">
                ${htmls}
            </div>
        `;
        roomContainerAnimate();
        bookRoomUIHandle();
        if (!isBranchBtnClick) document.documentElement.scrollTop -= 0.001; 
        // func children
        function roomContainerAnimate() {
            const roomContainers = X$$('.room-container');
            roomContainers.forEach(element => {
                let isHover = false;
                let delayA;
                const backgroundElement = element.querySelector('.background');
                element.onmouseenter = () => {
                    backgroundElement.classList.add('start');
                    backgroundElement.classList.remove('end');
                    delayA = setTimeout(() => {
                        isHover = true;
                    }, 500);
                };
                element.onmouseleave = () => {
                    clearTimeout(delayA);
                    if (!isHover) {
                        backgroundElement.classList.remove('start');
                        return;
                    };
                    backgroundElement.classList.remove('start');
                    backgroundElement.classList.add('end');
                    isHover = false;
                };
            });
        };
        // remove unecessary element
        X$('.loader') && loader('hide');
        X$('.overlay') && overlay('hide');
        X$('.notifi') && X$('.notifi').remove();
    };
    function bookRoomUIHandle() {
        const url = 'http://localhost:3000/roomList';
        const roomItems = X$$('.room-container');
        roomItems.forEach(room => {
            if (room.classList.contains('pointerNone')) return;
            room.onclick = async() => {
                const id = room.getAttribute('ID');
                const containerLeftContent = X$('.container-left-content');
                const res = await getTodo(url + '/' + id);
                if (res.status !== 'Đang trống!') {
                    const title = 'Phòng này đã được đặt, quý khách vui lòng chọn phòng khác!';
                    const notifiEl = createNotifiElement(title);
                    const btnConfirm = notifiEl.querySelector('.btn-submit');
                    btnConfirm.onclick = getDataRoomToHandle;
                    return;
                };
                const { avatar, roomName, amount, roomType, roomDecription, imgReview } = res;
                containerLeftContent.innerHTML = `
                <div class="container-left-roomInfoContainer">
                    <div class="container-left-roomInfoContainer__header">
                        <div class="container-left-roomInfoContainer__header-avtContainer">
                            <div class="container-left-roomInfoContainer__headerAvtImg">
                                <img class="container-left-roomInfoContainer__headerAvtImg-img" src="${avatar || ''}" alt="">
                            </div>
                            <div class="container-left-roomInfoContainer__header-backgroundImg">
                                <img class="container-left-roomInfoContainer__header-backgroundImg-img" src="${avatar || ''}" alt="">
                            </div>
                            <div class="container-left-roomInfoContainer__header-overlay"></div>
                            <div class="container-left-roomInfoContainer__header-roomName center">${roomName}</div>
                        </div>
                    </div>

                    <div class="container-left-roomInfoContainer__body">
                        <div class="container-left-roomInfoContainer__body-info">
                            <span class="container-left-roomInfoContainer__body-info-content">
                                Phòng ${amount} người. <br>
                                Hạng phòng: ${roomType === 'normal' && 'Phổ thông.'
                                            || roomType === 'premier' && 'Cao cấp.'
                                            }
                            </span>
                        </div>
                        
                        <form class="container-left-roomInfoContainer__body-bookRoomForm">
                            <span class="container-left-roomInfoContainer__body-bookRoomForm-title">
                                Chúng tôi sẽ liên hệ cho bạn!
                            </span>
                            <div class="signIn-form__box-input">
                                <input class="box-input-phoneNumb" type="number" placeholder=" ">
                                <div class="signIn-form__placeholderInput">
                                    <span class="signIn-form__placeholderInput-text">Số điện thoại của bạn</span>
                                    <i class="fa-solid fa-triangle-exclamation icon-warning"></i>
                                </div>
                                <div class="signIn-form__line"></div>
                            </div>
                            <div class="signIn-form__box-input">
                                <input class="box-input-phoneNumb" type="text" placeholder=" ">
                                <div class="signIn-form__placeholderInput">
                                    <span class="signIn-form__placeholderInput-text">Địa chỉ email</span>
                                    <i class="fa-solid fa-triangle-exclamation icon-warning"></i>
                                </div>
                                <div class="signIn-form__line"></div>
                            </div>
                            <div class="err-form-notifi">
                                <span class="err-form-notifi__content">
                                    Vui lòng nhập đúng số điện thoại của bạn!
                                </span>
                                <span class="err-form-notifi__content">
                                    Email không hợp lệ!
                                </span>
                            </div>
                            <div class="signIn-form__button-box">
                                <div class="btn">Gửi cho chúng tôi</div>
                                <i></i>
                            </div>
                            <div class="container-left-roomInfoContainer__body-bookRoomForm-info">
                                <span class="body-bookRoomForm-info__title">
                                        Hoặc liên hệ với chúng tôi để được tư vấn! (miễn phí cước)
                                </span>
                                <div class="body-bookRoomForm-info__phoneNumb">
                                    <lord-icon
                                        src="https://cdn.lordicon.com/ssvybplt.json"
                                        trigger="loop-on-hover"
                                        colors="primary:black"
                                        target="div"
                                        delay="100"
                                        state="hover-phone-ring"
                                        style="width: 30px;height: 30px">
                                    </lord-icon>
                                    <span>0933069587</span>
                                </div>
                            </div>
                        </form>

                        <div class="container-left-roomInfoContainer__body-decription">
                            <span class="container-left-roomInfoContainer__body-decription-title">Mô tả</span>
                            <span class="container-left-roomInfoContainer__body-decription-content">${roomDecription}</span>
                        </div>

                        <div style="opacity: 0; pointer-events: none;" class="container-left-roomInfoContainer__body-roomImg">
                            <span class="container-left-roomInfoContainer__body-roomImg-title">Hình ảnh phòng</span>
                            <div class="container-left-roomInfoContainer__body-roomImg-wrapper">
                                <div id="mainCarousel" class="carousel w-10/12 max-w-5xl mx-auto">
                                    ${renderImgReview(imgReview, 'mainCarousel')}
                                </div>
                                <div id="thumbCarousel" class="carousel max-w-xl mx-auto">
                                    ${renderImgReview(imgReview, 'thumbCarousel')}    
                                </div>
                            </div>
                        </div>

                        <div class="container-left-roomInfoContainer__body-convenient">
                            <span class="container-left-roomInfoContainer__body-convenient-title">Tiện Nghi</span>
                            <div class="container-left-roomInfoContainer__body-convenient-content">
                                ${renderHTMLconvenient(roomType)}
                            </div>
                        </div>
                    </div>
                </div>
                `;

                const menuCtn = X$('.container-left-menuContainer');
                menuCtn.scrollIntoView({ behavior: "auto", block: "start" });
                bookRoomHandle(url, id);
                fancyboxHandle(X$('.container-left-roomInfoContainer__body-roomImg')
                                , '.container-left-roomInfoContainer__body-roomImg-wrapper-a'
                                , 'room-info');
                getIDroom = id;
                autoActiveMenuRoomBtn();
            };
        });

        // func children
        function renderImgReview(datas, el) {
            if (el === 'mainCarousel') {
                const htmls = datas.map(data => {
                    return `
                    <div class="carousel__slide container-left-roomInfoContainer__body-roomImg-wrapper-a" data-src="${data}" data-fancybox="gallery">
                        <img src="${data}" />
                    </div>
                    `;
                }).join('\n');
                return htmls;
            };
            if (el === 'thumbCarousel') {
                const htmls = datas.map(data => {
                    return `
                    <div class="carousel__slide container-left-roomInfoContainer__body-roomImg-wrapper-a">
                        <img class="panzoom__content" src="${data}" />
                    </div>
                    `;
                }).join('\n');
                return htmls;
            };
        };
        function renderHTMLconvenient(datas) {
            if (datas === 'normal') {
                return `
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/giuong-ngu.svg" alt="">
                        <span>Trang bị trong phòng</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/ao-tam.svg" alt="">
                            <span>Áo choàng tắm</span>
                        </li>
                        <li>
                            <img src="../svg-link/hop-tien-nghi.svg" alt="">
                            <span>Hộp tiện nghi</span>
                        </li>
                        <li>
                            <img src="../svg-link/khay-tra.svg" alt="">
                            <span>Khay trà</span>
                        </li>
                        <li>
                            <img src="../svg-link/bien-bao-cam-hut-thuoc.svg" alt="">
                            <span>Biển báo cấm hút thuốc</span>
                        </li>
                        <li>
                            <img src="../svg-link/the-tu-khoa-phong.svg" alt="">
                            <span>Thẻ từ khóa phòng</span>
                        </li>
                    </div>
                </div>
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/thu-gian.svg" alt="">
                        <span>Thư giãn & vui chơi giải trí</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/san-vuon.svg" alt="">
                            <span>Sân vườn</span>
                        </li>
                        <li>
                            <img src="../svg-link/yoga.svg" alt="">
                            <span>KIN Fitness & Yoga</span>
                        </li>
                    </div>
                </div>
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/an-uong.svg" alt="">
                        <span>Ăn uống</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/nha-hang.svg" alt="">
                            <span>Sân vườn</span>
                        </li>
                        <li>
                            <img src="../svg-link/bar&coffee.svg" alt="">
                            <span>KIN Fitness & Yoga</span>
                        </li>
                        <li>
                            <img src="../svg-link/pint-beer.svg" alt="">
                            <span>PINT BEER</span>
                        </li>
                    </div>
                </div>
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/league.svg" alt="">
                        <span>Ngôn ngữ sử dụng</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/vietnam's-flag.svg" alt="">
                            <span>Tiếng Việt</span>
                        </li>
                        <li>
                            <img src="../svg-link/british-flag.svg" alt="">
                            <span>Tiếng Anh</span>
                        </li>
                    </div>
                </div>
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/nguoi-khuyet-tat.svg" alt="">
                        <span>Khả năng tiếp cận cho người khuyết tật</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/thang-may.svg" alt="">
                            <span>Thang máy</span>
                        </li>
                    </div>
                </div>
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/dich-vu.svg" alt="">
                        <span>Dịch vụ</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/ket-an-toan.svg" alt="">
                            <span>Két an toàn</span>
                        </li>
                        <li>
                            <img src="../svg-link/nuoc-dong-chai-free.svg" alt="">
                            <span>Nước đóng chai miễn phí</span>
                        </li>
                    </div>
                </div>
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/san-bay.svg" alt="">
                        <span>Sân bay lân cận</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/san-bay-Lien-Khuong.svg" alt="">
                            <span>Sân bay Liên Khương (DLI)</span>
                        </li>
                    </div>
                </div>
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/di-lai.svg" alt="">
                        <span>Đi lại</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/bai-dau-xe.svg" alt="">
                            <span>Bãi đậu xe</span>
                        </li>
                        <li>
                            <img src="../svg-link/san-bay-Lien-Khuong.svg" alt="">
                            <span>Đưa đón sân bay</span>
                        </li>
                    </div>
                </div>
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/internet.svg" alt="">
                        <span>Truy cập internet</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/wifi.svg" alt="">
                            <span>Wifi nơi công cộng</span>
                        </li>
                    </div>
                </div>
                `;
            };
            if (datas === 'premier') {
                return `
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/giuong-ngu.svg" alt="">
                        <span>Trang bị trong phòng</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/tivi.svg" alt="">
                            <span>Tivi</span>
                        </li>
                        <li>
                            <img src="../svg-link/tu-lanh.svg" alt="">
                            <span>Tủ lạnh</span>
                        </li>
                        <li>
                            <img src="../svg-link/hop-so-cuu.svg" alt="">
                            <span>Hộp sơ cứu</span>
                        </li>
                        <li>
                            <img src="../svg-link/dien-thoai-ban.svg" alt="">
                            <span>Điện thoại bàn</span>
                        </li>
                        <li>
                            <img src="../svg-link/may-say-toc.svg" alt="">
                            <span>Máy sấy tóc</span>
                        </li>
                        <li>
                            <img src="../svg-link/am-dun-nuoc.svg" alt="">
                            <span>Ấm đun nước</span>
                        </li>
                        <li>
                            <img src="../svg-link/moc-ao-co-kep.svg" alt="">
                            <span>Móc áo có kẹp</span>
                        </li>
                        <li>
                            <img src="../svg-link/moc-ao-khong-co-kep.svg" alt="">
                            <span>Móc áo không có kẹp</span>
                        </li>
                        <li>
                            <img src="../svg-link/nem-gap-gon.svg" alt="">
                            <span>Nệm gấp gọn</span>
                        </li>
                        <li>
                            <img src="../svg-link/ao-tam.svg" alt="">
                            <span>Áo choàng tắm</span>
                        </li>
                        <li>
                            <img src="../svg-link/dep-trong-phong.svg" alt="">
                            <span>Dép trong phòng</span>
                        </li>
                        <li>
                            <img src="../svg-link/ly-thuy-tinh-cao.svg" alt="">
                            <span>Ly thủy tinh cao</span>
                        </li>
                        <li>
                            <img src="../svg-link/ly-uong-tra.svg" alt="">
                            <span>Ly uống trà</span>
                        </li>
                        <li>
                            <img src="../svg-link/dia-lot-ly.svg" alt="">
                            <span>Đĩa lót ly</span>
                        </li>
                        <li>
                            <img src="../svg-link/muong-coffee.svg" alt="">
                            <span>Muỗng uống cà phê</span>
                        </li>
                        <li>
                            <img src="../svg-link/hop-khan-giay.svg" alt="">
                            <span>Hộp khăn giấy</span>
                        </li>
                        <li>
                            <img src="../svg-link/khay.svg" alt="">
                            <span>Khay</span>
                        </li>
                        <li>
                            <img src="../svg-link/guong-trang-diem.svg" alt="">
                            <span>Gương trang điểm</span>
                        </li>
                        <li>
                            <img src="../svg-link/rem-toi-mau.svg" alt="">
                            <span>Rèm tối màu</span>
                        </li>
                        <li>
                            <img src="../svg-link/rem-voan.svg" alt="">
                            <span>Rèm voan</span>
                        </li>
                        <li>
                            <img src="../svg-link/de-ly.svg" alt="">
                            <span>Đế ly</span>
                        </li>
                        <li>
                            <img src="../svg-link/hop-tien-nghi.svg" alt="">
                            <span>Hộp tiện nghi</span>
                        </li>
                        <li>
                            <img src="../svg-link/khay-tra.svg" alt="">
                            <span>Khay trà</span>
                        </li>
                        <li>
                            <img src="../svg-link/cua-kinh-phong-tam.svg" alt="">
                            <span>Cửa kính phòng tắm</span>
                        </li>
                        <li>
                            <img src="../svg-link/gia-de-khan.svg" alt="">
                            <span>Giá để khăn</span>
                        </li>
                        <li>
                            <img src="../svg-link/ghe.svg" alt="">
                            <span>Ghế</span>
                        </li>
                        <li>
                            <img src="../svg-link/nem-bao-ve.svg" alt="">
                            <span>Nệm bảo vệ</span>
                        </li>
                        <li>
                            <img src="../svg-link/guong-trong-phong-tam.svg" alt="">
                            <span>Gương trong phòng tắm</span>
                        </li>
                        <li>
                            <img src="../svg-link/goi.svg" alt="">
                            <span>Gối</span>
                        </li>
                        <li>
                            <img src="../svg-link/ga-trai-giuong.svg" alt="">
                            <span>Ga trải giường</span>
                        </li>
                        <li>
                            <img src="../svg-link/vo-chan.svg" alt="">
                            <span>Vỏ chăn</span>
                        </li>
                        <li>
                            <img src="../svg-link/vo-goi.svg" alt="">
                            <span>Vỏ gối</span>
                        </li>
                        <li>
                            <img src="../svg-link/chan_men.svg" alt="">
                            <span>Chăn mền</span>
                        </li>
                        <li>
                            <img src="../svg-link/den-ngu.svg" alt="">
                            <span>Đèn ngủ</span>
                        </li>
                        <li>
                            <img src="../svg-link/goi-trang-tri.svg" alt="">
                            <span>Gối trang trí</span>
                        </li>
                        <li>
                            <img src="../svg-link/nem-ghe-dai.svg" alt="">
                            <span>Nệm ghế dài</span>
                        </li>
                        <li>
                            <img src="../svg-link/khan-tam.svg" alt="">
                            <span>Khăn tắm</span>
                        </li>
                        <li>
                            <img src="../svg-link/khan-mat.svg" alt="">
                            <span>Khăn mặt</span>
                        </li>
                        <li>
                            <img src="../svg-link/khan-tay.svg" alt="">
                            <span>Khăn tay</span>
                        </li>
                        <li>
                            <img src="../svg-link/tham-tam.svg" alt="">
                            <span>Thảm tắm</span>
                        </li>
                        <li>
                            <img src="../svg-link/bon-rua.svg" alt="">
                            <span>Bồn rửa</span>
                        </li>
                        <li>
                            <img src="../svg-link/bon-ve-sinh.svg" alt="">
                            <span>Bồn vệ sinh</span>
                        </li>
                        <li>
                            <img src="../svg-link/nem.svg" alt="">
                            <span>Nệm</span>
                        </li>
                        <li>
                            <img src="../svg-link/bien-bao-cam-hut-thuoc.svg" alt="">
                            <span>Biển báo cấm hút thuốc</span>
                        </li>
                        <li>
                            <img src="../svg-link/the-tu-khoa-phong.svg" alt="">
                            <span>Thẻ từ khóa phòng</span>
                        </li>
                        <li>
                            <img src="../svg-link/guong-trang-diem-nho.svg" alt="">
                            <span>Gương trang điểm nhỏ</span>
                        </li>
                        <li>
                            <img src="../svg-link/can.svg" alt="">
                            <span>Cân</span>
                        </li>
                        <li>
                            <img src="../svg-link/den-doc-sach.svg" alt="">
                            <span>Đèn đọc sách</span>
                        </li>
                        <li>
                            <img src="../svg-link/ban-tra.svg" alt="">
                            <span>Bàn trà</span>
                        </li>
                    </div>
                </div>
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/thu-gian.svg" alt="">
                        <span>Thư giãn & vui chơi giải trí</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/san-vuon.svg" alt="">
                            <span>Sân vườn</span>
                        </li>
                        <li>
                            <img src="../svg-link/yoga.svg" alt="">
                            <span>KIN Fitness & Yoga</span>
                        </li>
                    </div>
                </div>
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/an-uong.svg" alt="">
                        <span>Ăn uống</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/bua-sang.svg" alt="">
                            <span>Bữa sáng</span>
                        </li>
                        <li>
                            <img src="../svg-link/nha-hang.svg" alt="">
                            <span>Nhà hàng</span>
                        </li>
                        <li>
                            <img src="../svg-link/bar&coffee.svg" alt="">
                            <span>The Lobby bar&coffee</span>
                        </li>
                        <li>
                            <img src="../svg-link/pint-beer.svg" alt="">
                            <span>PINT BEER</span>
                        </li>
                    </div>
                </div>
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/league.svg" alt="">
                        <span>Ngôn ngữ sử dụng</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/vietnam's-flag.svg" alt="">
                            <span>Tiếng Việt</span>
                        </li>
                        <li>
                            <img src="../svg-link/british-flag.svg" alt="">
                            <span>Tiếng Anh</span>
                        </li>
                    </div>
                </div>
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/nguoi-khuyet-tat.svg" alt="">
                        <span>Khả năng tiếp cận cho người khuyết tật</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/thang-may.svg" alt="">
                            <span>Thang máy</span>
                        </li>
                    </div>
                </div>
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/dich-vu.svg" alt="">
                        <span>Dịch vụ</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/ket-an-toan.svg" alt="">
                            <span>Két an toàn</span>
                        </li>
                        <li>
                            <img src="../svg-link/nuoc-dong-chai-free.svg" alt="">
                            <span>Nước đóng chai miễn phí</span>
                        </li>
                    </div>
                </div>
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/san-bay.svg" alt="">
                        <span>Sân bay lân cận</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/san-bay-Lien-Khuong.svg" alt="">
                            <span>Sân bay Liên Khương (DLI)</span>
                        </li>
                    </div>
                </div>
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/di-lai.svg" alt="">
                        <span>Đi lại</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/bai-dau-xe.svg" alt="">
                            <span>Bãi đậu xe</span>
                        </li>
                        <li>
                            <img src="../svg-link/san-bay-Lien-Khuong.svg" alt="">
                            <span>Đưa đón sân bay</span>
                        </li>
                    </div>
                </div>
                <div class="body-convenient-content__item">
                    <div class="body-convenient-content__item-header">
                        <img src="../svg-link/internet.svg" alt="">
                        <span>Truy cập internet</span>
                    </div>
                    <div class="body-convenient-content__item-body">
                        <li>
                            <img src="../svg-link/wifi.svg" alt="">
                            <span>Wifi nơi công cộng</span>
                        </li>
                    </div>
                </div>
                `;
            };
        };
        function autoActiveMenuRoomBtn() {
            const menuCtn = X$('.container-left__menu');
            const menuRoomItem = menuCtn.querySelector('.item[type="room"]');
            const lastItemActive = menuCtn.querySelector('.container-left__menu .item.active');
            if (lastItemActive) { lastItemActive.classList.remove('active') };
            const lastItemStart = menuCtn.querySelector('.container-left__menu .item .start');
            if (lastItemStart) { lastItemStart.remove() };
            menuRoomItem.classList.add('active');
            addBackgroundEff();
        };
    };
    function bookRoomHandle(url, id) {
        const bookRoomForm = X$('.container-left-roomInfoContainer__body-bookRoomForm');
        const btnBookRoomForm = X$('.container-left-roomInfoContainer__body-bookRoomForm .signIn-form__button-box .btn');
        iconWarningAnimate(bookRoomForm, btnBookRoomForm);
        sendInfoHandle();

          // func children;
        function sendInfoHandle() {
            const btnSendInfo = bookRoomForm.querySelector('.signIn-form__button-box .btn');
            const inputs = bookRoomForm.querySelectorAll('input');
            const [ inputPhoneNumb, inputEmail] = inputs;
            const notifis = bookRoomForm.querySelectorAll('.err-form-notifi__content');
            const [ notifiPhoneNumb, notifiEmail ] = notifis;

            btnSendInfo.onclick = async() => {
                const res = await getTodo(url + '/' + id);
                const { status } = res;
                const array = [];
                inputs.forEach(input => { if (input.value.trim() === '') array.push(input.value.trim()) });
                inputs.forEach((input, index) => {
                    input.onfocus = () => {
                        input.classList.remove('red-border');
                        notifis[index].classList.remove('active');
                    };
                });
                if (array.length) return;

                if (inputPhoneNumb.value.trim() && inputPhoneNumb.value.trim().length < 10) {
                    notifiPhoneNumb.classList.add('active');
                    inputPhoneNumb.classList.add('red-border');
                    return;
                };
    
                const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
                if (!inputEmail.value.match(pattern)) {
                    notifiEmail.classList.add('active');
                    inputEmail.classList.add('red-border');
                    return;
                };

                if (status !== 'Đang trống!') {
                    const title = 'Phòng này đã được đặt, quý khách vui lòng chọn phòng khác!';
                    const notifiEl = createNotifiElement(title);
                    const btnConfirm = notifiEl.querySelector('.btn-submit');
                    btnConfirm.onclick = () => { getDataRoomToHandle('clear-roomInfoContainer') };
                    return;
                };

                const objData = {};
                objData.status = 'Đang đặt!';
                objData.customerInformation = {
                    phoneNumber: inputPhoneNumb.value.trim(),
                    amount: null,
                    IDcard: null,
                    name: null,
                    email: inputEmail.value.trim(),
                };
                usingFetch('PATCH', url + '/' + id, objData)
                    .then(() => {
                        const title = 'Chúng tôi sẽ liên hệ cho bạn trong thời gian sớm nhất!';
                        const notifiEl = createNotifiElement(title);
                        const btnSubmit = notifiEl.querySelector('.btn-submit');
                        btnSubmit.onclick = () => {
                            inputs.forEach(input => { input.value = '' });
                            getDataRoomToHandle();
                        };
                    })
            };
        };
    };

    function notFoundFormHandle() {
        const url = 'http://localhost:3000/roomList';
        const form = X$('.containerSendInfo-form');
        const btnSubmit = form.querySelector('.containerSendInfo-form .signIn-form__button-box .btn');
        const inputs = form.querySelectorAll('input');
        const [ inputPhoneNumb, inputEmail ] = inputs
        const notifis = form.querySelectorAll('.err-form-notifi__content');
        const [ notifiPhoneNumb, notifiEmail ] = notifis;
        iconWarningAnimate(form, btnSubmit);

        btnSubmit.onclick = () => {
            const arr = [];
            inputs.forEach(input => { if (input.value.trim() === '') arr.push(input.value.trim()) });
            inputs.forEach((input, index) => {
                input.onfocus = () => {
                    input.classList.remove('red-border');
                    notifis[index].classList.remove('active');
                };
            });
            if (arr.length) return;

            if (inputPhoneNumb.value.trim() && inputPhoneNumb.value.trim().length < 10) {
                notifiPhoneNumb.classList.add('active');
                inputPhoneNumb.classList.add('red-border');
                return;
            };

            const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
            if (!inputEmail.value.match(pattern)) {
                notifiEmail.classList.add('active');
                inputEmail.classList.add('red-border');
                return;
            };

            const objData =  {
                avatar: [
                    '../img/logo.png'
                ],
                roomName: 'Không rõ',
                roomType: 'Không rõ',
                amount: 'Không rõ',
                branch: 'TP HCM',
                status: 'Đang đặt!',
                customerInformation: {
                    phoneNumber: inputPhoneNumb.value.trim(),
                    amount: null,
                    IDcard: null,
                    name: null,
                    email: inputEmail.value.trim(),
                },
                isNotRoom: true,
            }
            usingFetch('POST', url, objData)
                .then(() => {
                    const title = 'Chúng tôi sẽ liên hệ cho bạn trong thời gian sớm nhất!';
                    const notifiEl = createNotifiElement(title);
                    const btnSubmit = notifiEl.querySelector('.btn-submit');
                    btnSubmit.onclick = () => {
                        overlay('hide');
                        notifiEl.remove();
                        inputs.forEach(input => { input.value = '' });
                    };
                })
        };
    };
    
    function stickyElement(stickyElement, container, addClass, type) {
        if (type === 1) {
            let b = 0;
            let defaultTop = stickyElement.offsetTop;
            calc();
            document.addEventListener('scroll', calc);
            // func children
            function calc() {
                let a = window.scrollY;
                let calc = Math.round(stickyElement.getBoundingClientRect().y - (stickyElement.offsetTop - a));
                let result = Math.abs(calc);
                if (a > b) {
                    if (a > defaultTop + result) {
                        stickyElement.style.top = a - result + 'px';
                        addClass && stickyElement.classList.add(addClass);
                    } else {
                        stickyElement.style.top = defaultTop + 'px';
                    }
                    if (container && a + stickyElement.offsetHeight > container.offsetHeight)
                    stickyElement.style.top = container.offsetHeight - stickyElement.offsetHeight - result + 'px';
                } else if (a < b) {
                    if (a < defaultTop + result) {
                        stickyElement.style.top = defaultTop + 'px';
                        addClass && stickyElement.classList.remove(addClass);
                    } else {
                        stickyElement.style.top = a - result + 'px';
                    }
                    if (container && a + stickyElement.offsetHeight > container.offsetHeight) 
                    stickyElement.style.top = container.offsetHeight - stickyElement.offsetHeight - result + 'px';
                };
                b = a;
            };
        };
        if (type === 2) {
            let b = 0;
            let defaultTop = stickyElement.offsetTop;
            calc();
            document.addEventListener('scroll', calc);
            // func children
            function calc() {
                let a = window.scrollY;
                let calc = Math.round(stickyElement.getBoundingClientRect().y - (stickyElement.offsetTop - a));
                let result = Math.abs(calc);
                if (a > b) {
                    if (a > defaultTop + result) {
                        stickyElement.style.top = a - result - defaultTop + 'px';
                        addClass && stickyElement.classList.add(addClass);
                    } else {
                        stickyElement.style.top = 0 + 'px';
                    }
                    if (container && a + stickyElement.offsetHeight > container.offsetHeight)
                    stickyElement.style.top = container.offsetHeight - stickyElement.offsetHeight - result - defaultTop + 'px';
                } else if (a < b) {
                    if (a < defaultTop + result) {
                        stickyElement.style.top = 0 + 'px';
                        addClass && stickyElement.classList.remove(addClass);
                    } else {
                        stickyElement.style.top = a - result - defaultTop + 'px';
                    }
                    if (container && a + stickyElement.offsetHeight > container.offsetHeight) 
                    stickyElement.style.top = container.offsetHeight - stickyElement.offsetHeight - result - defaultTop + 'px';
                };
                b = a;
            };
        };
    };
    
    async function usingFetch(method, url, datas) {
        switch (method) {
            default: console.log('Vui lòng kiểm tra lại method!')
                break;
            case 'POST':
                return fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datas)
                })
            case 'PATCH':
                return fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datas)
                })
            case 'PUT':
                return fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datas)
                })
            case 'DELETE':
                return fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' }
                })
        };
    };

    function overlay(action) {
        if (action === 'hide') {
            document.querySelector('.overlay').remove();
            document.body.style.overflow = 'unset';
            return;
        };
        const element = document.createElement('div');
        element.className = 'overlay';
        document.body.appendChild(element);
        document.body.style.overflow = 'hidden';
    };

    function loader(action) {
        if (action === 'hide') {
            document.querySelector('.loader').remove();
            return;
        };
        const element = document.createElement('div');
        element.className = 'loader';
        element.innerHTML = `
            <div class="loader__ring"></div>
            <span>loading...</span>
        `;
        document.body.appendChild(element);
    };

    function randomVerificationCode() {
        let chars = '0123456789qwertyuiopasdfghjklzxcvbnmQƯERTYUIOPASDFGHJKLZXCVBNM';
        let length = 10;
        let code = '';
        for (let i = 0; i < length; i++) {
            let random = Math.floor(Math.random() * chars.length);
            code += chars.substring(random, random + 1);
        }
        return code;
    };

    function circle(params) {
        const btnGetCode = params[0];
        btnGetCode.onclick = null;
        const second = btnGetCode.querySelector('.text');
        let counter = 20;
        second.innerText = counter;
        const a = setInterval(() => {
            if (counter === 0) {
                clearInterval(a);
                btnGetCode.innerHTML = "Nhận mã";
                btnGetCode.onclick = () => { btnGetCodeHandle(...params) };
            } else {
                counter--;
                second.innerText = counter;
            }
        }, 1000);
    };

    function STORAGE(key) {
        let store = JSON.parse(localStorage.getItem(key)) || {};
        function save() { localStorage.setItem(key, JSON.stringify(store)) };
        let storage = {
            get(key) {
                return store[key]
            },
            set(key, value) {
                store[key] = value
                save()
            },
            remove(key) {
                delete store[key]
                save()
            }
        };
        return storage
    };

    function fancyboxHandle(el, className, type) {
        Fancybox.Plugins.Toolbar.defaults.items.thumbs = {
            type: "button",
            label: "TOGGLE_THUMBS",
            class: "fancybox__button--thumbs",
            html: '<i class="fa-solid fa-rectangle-history-circle-plus"></i>',
            click: function (event) {
                event.stopPropagation();
                const thumbs = this.fancybox.plugins.Thumbs;
                if (thumbs) {
                    thumbs.toggle();
                }
            },
        };
        Fancybox.Plugins.Toolbar.defaults.items.zoom = {
            type: "button",
            class: "fancybox__button--zoom",
            label: "TOGGLE_ZOOM",
            html: '<i class="fa-sharp fa-solid fa-magnifying-glass"></i>',
            click: function (event) {
                event.preventDefault();
                const panzoom = this.fancybox.getSlide().Panzoom;
                if (panzoom) {
                    panzoom.toggleZoom();
                }
            },
        };
        Fancybox.Plugins.Toolbar.defaults.items.slideshow = {
            type: "button",
            class: "fancybox__button--slideshow",
            label: "TOGGLE_SLIDESHOW",
            html: `<i class="fa-solid fa-clapperboard-play"></i>`,
            click: function (event) {
                event.preventDefault();
                this.Slideshow.toggle();
            },
        };
        Fancybox.Plugins.Toolbar.defaults.items.fullscreen = {
            type: "button",
            class: "fancybox__button--fullscreen",
            label: "TOGGLE_FULLSCREEN",
            html: `<i class="fa-sharp fa-solid fa-expand"></i>`,
            click: function (event) {
                event.preventDefault();
                toggleFullScreen();
            },
        };
        Fancybox.Plugins.Toolbar.defaults.items.download = {
            type: "link",
            label: "DOWNLOAD",
            class: "fancybox__button--download",
            html: '<i class="fa-solid fa-file-arrow-down"></i>',
            click: function (event) {
                event.stopPropagation();
                event.preventDefault();
                const activeElement = X$('.fancybox__slide.is-selected.has-image');
                const img = activeElement.querySelector('img');
                htmlToImage.toPng(img)
                    .then(function (dataUrl) {
                        const a = document.createElement('a');
                        a.download = "KIN-img.png";
                        a.href = dataUrl;
                        a.click();
                        a.remove();
                    })
                    .catch(function (error) {
                        console.log('Lỗi rồi nè:', error);
                    });
            },
        };
        Fancybox.Plugins.Toolbar.defaults.items.close = {
            type: "button",
            label: "CLOSE",
            class: "fancybox__button--close",
            html: '<i class="fa-sharp fa-solid fa-xmark"></i>',
            tabindex: 1,
            click: function (event) {
                event.stopPropagation();
                event.preventDefault();
                this.fancybox.close();
            },
        };
        Fancybox.Plugins.Toolbar.defaults.items.next = {
            type: "button",
            class: "fancybox__button--next",
            label: "NEXT",
            html: '<i class="fa-solid fa-caret-right"></i>',
            click: function (event) {
                event.preventDefault();
                this.fancybox.next();
            },
        };
        Fancybox.Plugins.Toolbar.defaults.items.prev = {
            type: "button",
            class: "fancybox__button--prev",
            label: "NEXT",
            html: '<i class="fa-solid fa-caret-left"></i>',
            click: function (event) {
                event.preventDefault();
                this.fancybox.prev();
            },
        };
        if (type === 'room-info') {
            const mainCarousel = new Carousel(document.querySelector(".container-left-roomInfoContainer__body-roomImg-wrapper #mainCarousel"), {
                Dots: false,
                Navigation: {
                    prevTpl:
                        '<i class="fa-solid fa-caret-left"></i>',
                    nextTpl:
                        '<i class="fa-solid fa-caret-right"></i>',
                },
                on: {
                    ready: (carousel) => {
                        const mainCarouselEl = X$('.container-left-roomInfoContainer__body-roomImg-wrapper #mainCarousel');
                        const btnNav = X$$('.container-left-roomInfoContainer__body-roomImg-wrapper #mainCarousel .carousel__button');
                        let delay;
                        mainCarouselEl.onmousemove = mouseMove;
                        btnNav.forEach(btn => {
                            btn.onmouseenter = () => {
                                clearTimeout(delay);
                                btnNav.forEach(btn => {
                                    btn.style.opacity = '1';
                                    btn.style.pointerEvents = 'unset';
                                });
                                mainCarouselEl.onmousemove = () => {};
                            };
                            btn.onmouseleave = () => {
                                mouseMove();
                                mainCarouselEl.onmousemove = mouseMove;
                            };
                        });
                        // func children
                        function mouseMove() {
                            clearTimeout(delay);
                            btnNav.forEach(btn => {
                                btn.style.opacity = '1';
                                btn.style.pointerEvents = 'unset';
                            });
                            delay = setTimeout(() => {
                                btnNav.forEach(btn => {
                                    btn.style.opacity = '0';
                                    btn.style.pointerEvents = 'none';
                                });
                            }, 2000);
                        };
                    },
                },
            });
            new Carousel(document.querySelector(".container-left-roomInfoContainer__body-roomImg-wrapper #thumbCarousel"), {
                Sync: {
                    target: mainCarousel,
                    friction: 0,
                },
                Dots: false,
                Navigation: false,
                center: true,
                slidesPerPage: 1,
                infinite: false,
            });
    
            Fancybox.bind(className, {
                infinite: true,
                Image: {
                    Panzoom: {
                        zoomFriction: 0.7,
                        maxScale: function () {
                            return 4;
                        },
                    },
                    // zoom: true,
                    // doubleClick: 'toggleZoom',
                    click: 'toggleZoom',
                    // ignoreCoveredThumbnail: true,
                    wheel: 'slide',
                },
                // showClass: true,
                // hideClass: true,
                Thumbs: {
                    autoStart: false,
                    center: true,
                    Carousel: {
                        fill: false,
                        Sync: {
                            friction: 0
                        },
                        center: true,
                    },
                },
                animated: true,
                click: 'close',
                fullscreen: {
                    // autoStart: true,
                },
                ScrollLock: false,
                placeFocusBack: false,
                parentEl: X$('.container-left-roomInfoContainer__body-roomImg-wrapper'),
                Toolbar: {
                    display: [
                        { id: "prev", position: "center" },
                        { id: "counter", position: "center" },
                        { id: "next", position: "center" },
                        "zoom",
                        "slideshow",
                        "fullscreen",
                        "download",
                        "thumbs",
                        "close",
                    ],
                },
                Carousel: {
                    Dots: false,
                    Navigation: true,
                    infinite: false,
                    center: true,
                    slidesPerPage: 1,
                    friction: 0.8,
                    Navigation: {
                        prevTpl:
                            '<i class="fa-sharp fa-solid fa-backward"></i>',
                        nextTpl:
                            '<i class="fa-sharp fa-solid fa-forward"></i>',
                    },
                    on: {
                        change: (that) => {
                            mainCarousel.slideTo(mainCarousel.findPageForSlide(that.page), {
                                friction: 0,
                            });
                        },
                    },
                },
                on: {
                    "*": (event, fancybox, slide) => {
                        // console.log(`event: ${event}`);
                    },
                    ready: (fancybox, slide) => {
                        const btnSlideShow = X$('.carousel__button.fancybox__button--slideshow');
                        const btnToggleFullScreen = X$('.carousel__button.fancybox__button--fullscreen');
                        const arrEl = [
                            btnSlideShow,
                            btnToggleFullScreen,
                        ];
                        const catchErr = checkEl(arrEl);
                        if (catchErr.length) return;
                        btnSlideShow.onclick = () => {
                            const icon = btnSlideShow.querySelector('i');
                            icon.className === 'fa-solid fa-clapperboard-play' ?
                            icon.className = 'fa-sharp fa-solid fa-circle-pause' : icon.className = 'fa-solid fa-clapperboard-play';
                        };
                        btnToggleFullScreen.onclick = () => {
                            const icon = btnToggleFullScreen.querySelector('i');
                            icon.className === 'fa-sharp fa-solid fa-expand' ?
                            icon.className = 'fa-sharp fa-solid fa-compress' : icon.className = 'fa-sharp fa-solid fa-expand';
                        };
                        autoHiddenToolBar(X$('.container-left-roomInfoContainer__body-roomImg-wrapper'));
                    },
                    closing: () => {
                        getFullScreenElement() && document.exitFullscreen();
                        const parentEl = X$('.container-left-roomInfoContainer__body-roomImg-wrapper');
                        const fancyboxToolBar = parentEl.querySelector('.fancybox__toolbar');
                        const fancyboxContainer = parentEl.querySelector('.fancybox__container');
                        const carouselBtnNext = parentEl.querySelector('.fancybox__nav .carousel__button.is-next');
                        const carouselBtnPrev = parentEl.querySelector('.fancybox__nav .carousel__button.is-prev');
                        const arrEl = [
                            parentEl,
                            fancyboxToolBar,
                            fancyboxContainer,
                            carouselBtnNext,
                            carouselBtnPrev,
                        ];
                        const catchErr = checkEl(arrEl);
                        if (catchErr.length) return;
                        fancyboxToolBar.style.opacity = '0';
                        fancyboxContainer.onmousemove = () => {
                            fancyboxToolBar.style.opacity = '0';
                        };
                        [fancyboxToolBar, carouselBtnNext, carouselBtnPrev].forEach(el => (el.onmouseleave = () => {}));
                    },
                },
            });
        };

        if (type === 'default') {
            Fancybox.bind(className, {
                infinite: true,
                Image: {
                    Panzoom: {
                        zoomFriction: 0.7,
                        maxScale: function () {
                            return 4;
                        },
                    },
                    // zoom: true,
                    // doubleClick: 'toggleZoom',
                    click: 'toggleZoom',
                    // ignoreCoveredThumbnail: true,
                    wheel: 'slide',
                },
                // showClass: true,
                // hideClass: true,
                Thumbs: {
                    autoStart: false,
                    center: false,
                    Carousel: {
                        Sync: {
                            friction: 0
                        }
                    },
                },
                animated: true,
                click: 'close',
                fullscreen: {
                    // autoStart: true,
                },
                ScrollLock: false,
                placeFocusBack: false,
                parentEl: X$('.container-left-serviecCtn'),
                Toolbar: {
                    display: [
                        { id: "prev", position: "center" },
                        { id: "counter", position: "center" },
                        { id: "next", position: "center" },
                        "zoom",
                        "slideshow",
                        "fullscreen",
                        "download",
                        "thumbs",
                        "close",
                    ],
                },
                Carousel: {
                    Dots: false,
                    Navigation: true,
                    infinite: false,
                    center: true,
                    slidesPerPage: 1,
                    friction: 0.8,
                    Navigation: {
                        prevTpl:
                            '<i class="fa-sharp fa-solid fa-backward"></i>',
                        nextTpl:
                            '<i class="fa-sharp fa-solid fa-forward"></i>',
                    },
                },
                on: {
                    "*": (event, fancybox, slide) => {
                        // console.log(`event: ${event}`);
                    },
                    ready: (fancybox, slide) => {
                        const btnSlideShow = X$('.carousel__button.fancybox__button--slideshow');
                        const btnToggleFullScreen = X$('.carousel__button.fancybox__button--fullscreen');
                        const arrEl = [
                            btnSlideShow,
                            btnToggleFullScreen,
                        ];
                        const catchErr = checkEl(arrEl);
                        if (catchErr.length) return;
                        btnSlideShow.onclick = () => {
                            const icon = btnSlideShow.querySelector('i');
                            icon.className === 'fa-solid fa-clapperboard-play' ?
                            icon.className = 'fa-sharp fa-solid fa-circle-pause' : icon.className = 'fa-solid fa-clapperboard-play';
                        };
                        btnToggleFullScreen.onclick = () => {
                            const icon = btnToggleFullScreen.querySelector('i');
                            icon.className === 'fa-sharp fa-solid fa-expand' ?
                            icon.className = 'fa-sharp fa-solid fa-compress' : icon.className = 'fa-sharp fa-solid fa-expand';
                        };
                        autoHiddenToolBar(X$('.container-left-serviecCtn'));
                    },
                    closing: () => {
                        getFullScreenElement() && document.exitFullscreen();
                        const parentEl = X$('.container-left-serviecCtn');
                        const fancyboxToolBar = parentEl.querySelector('.fancybox__toolbar');
                        const fancyboxContainer = parentEl.querySelector('.fancybox__container');
                        const carouselBtnNext = parentEl.querySelector('.fancybox__nav .carousel__button.is-next');
                        const carouselBtnPrev = parentEl.querySelector('.fancybox__nav .carousel__button.is-prev');
                        const arrEl = [
                            parentEl,
                            fancyboxToolBar,
                            fancyboxContainer,
                            carouselBtnNext,
                            carouselBtnPrev,
                        ];
                        const catchErr = checkEl(arrEl);
                        if (catchErr.length) return;
                        fancyboxToolBar.style.opacity = '0';
                        fancyboxContainer.onmousemove = () => {
                            fancyboxToolBar.style.opacity = '0';
                        };
                        [fancyboxToolBar, carouselBtnNext, carouselBtnPrev].forEach(el => (el.onmouseleave = () => {}));
                    },
                },
            });
        };
        // func children
        function autoHiddenToolBar(parentEl) {
            const fancyboxContainer = parentEl.querySelector('.fancybox__container');
            const fancyboxToolBar = parentEl.querySelector('.fancybox__toolbar');
            const fancyboxNav = parentEl.querySelector('.fancybox__nav');
            const carouselBtnNext = parentEl.querySelector('.fancybox__nav .carousel__button.is-next');
            const carouselBtnPrev = parentEl.querySelector('.fancybox__nav .carousel__button.is-prev');
            const arrEl = [
                parentEl,
                fancyboxContainer,
                fancyboxToolBar,
                fancyboxNav,
                carouselBtnNext,
                carouselBtnPrev
            ];
            const catchErr = checkEl(arrEl);
            if (catchErr.length) return;
            let delay;
            delay = setTimeout(() => {
                fancyboxToolBar.style.opacity = '0';
                fancyboxNav.style.opacity = '0';
            }, 2000)
            fancyboxContainer.onmousemove = mouseMove;
            [fancyboxToolBar, carouselBtnNext, carouselBtnPrev].forEach(el => (el.onmouseenter = () => {
                clearTimeout(delay);
                fancyboxToolBar.style.opacity = '1';
                fancyboxNav.style.opacity = '1';
                fancyboxContainer.onmousemove = () => { };
            }));
            [fancyboxToolBar, carouselBtnNext, carouselBtnPrev].forEach(el => (el.onmouseleave = () => {
                fancyboxContainer.onmousemove = mouseMove;
            }));
            // func children
            function mouseMove() {
                clearTimeout(delay);
                fancyboxToolBar.style.opacity = '1';
                fancyboxNav.style.opacity = '1';
                delay = setTimeout(() => {
                    fancyboxToolBar.style.opacity = '0';
                    fancyboxNav.style.opacity = '0';
                }, 2000)
            };
        };
        function checkEl(els) {
            const err = [];
            const arr = [...els];
            arr.forEach(el => { !el && err.push(el) });
            return err;
        };
        // start
        function start() {
            if (!el) return;
            el.style.opacity = '1';
            el.style.pointerEvents = 'unset';
        };
        start();
    };

    function toggleFullScreen() {
        getFullScreenElement() ? document.exitFullscreen() 
        : document.documentElement.requestFullscreen().catch(e => {console.log(e)});
    };
    function getFullScreenElement() {
        return document.fullscreenElement
            || document.webkitFullScreenElement
            || document.mozFullScreenElement
            || document.msFullScreenElement;
    };

    function iconWarningAnimate(form, btn) {
        const inputs = form.querySelectorAll('input');
        const textareaS = form.querySelectorAll('textarea');
        // inputs
        inputs.forEach(input => {
            const icon = input.nextElementSibling.querySelector('i');
            input.addEventListener('focus', () => {
                if (input.value.trim() === '') input.value = '';
                icon.classList.remove('active');
            });
        });
        btn.addEventListener('click', () => {
            inputs.forEach(input => {
                const icon = input.nextElementSibling.querySelector('i');
                const animate = icon.animate(
                    [
                        { marginLeft: '6px' },
                        { marginLeft: '12px' },
                        { marginLeft: '6px' },
                        { marginLeft: '12px' },
                        { marginLeft: '6px' },
                    ],
                    { duration: 600, easing: 'ease' }
                );
                animate.pause();
                if (input.value.trim() === '') {
                    icon.classList.add('active');
                    animate.play();
                };
            });
        });
        // textareas
        if (!textareaS.length) return;
        textareaS.forEach(input => {
            const icon = input.nextElementSibling.querySelector('i');
            input.addEventListener('focus', () => {
                if (input.value.trim() === '') input.value = '';
                icon.classList.remove('active');
            });
        });
        btn.addEventListener('click', () => {
            textareaS.forEach(textarea => {
                const icon = textarea.nextElementSibling.querySelector('i');
                const animate = icon.animate(
                    [
                        { marginLeft: '6px' },
                        { marginLeft: '12px' },
                        { marginLeft: '6px' },
                        { marginLeft: '12px' },
                        { marginLeft: '6px' },
                    ],
                    { duration: 600, easing: 'ease' }
                );
                animate.pause();
                if (textarea.value.trim() === '') {
                    icon.classList.add('active');
                    animate.play();
                };
            });
        });
    };

    function createNotifiElement(title) {
        const createNotifi = document.createElement('div');
        createNotifi.className = 'notifi center';
        createNotifi.innerHTML = `
            <span class="notifi-content">${title}</span>
            <div class="create-form__btn-box">
                <div style="--background: var(--mainColor-); 
                    --active: linear-gradient(102.1deg, rgb(69, 198, 117) 8.7%, rgb(12, 111, 114) 88.1%);"
                    class="create-form__btn-submit btn btn-submit">
                    <span>Đã hiểu!</span>
                    <i></i>
                </div>
            </div>
        `;
        overlay();
        X$('.overlay').appendChild(createNotifi);
        return createNotifi;
    };

    function sortLibary(array, method, towards, key) {
        if (towards === "incr") {
            switch (method) {
                case "number":
                    if (key) {
                        array.sort((a, b) => {
                            return a[key] - b[key];
                        });
                        return array;
                    };
                    array.sort((a, b) => {
                        return a - b;
                    });
                    return array;
                case "string":
                    if (key) {
                        array.sort((a, b) => {
                            return a[key].localeCompare(b[key]);
                        });
                        return array;
                    };
                    array.sort((a, b) => {
                        return a.localeCompare(b);
                    });
                    return array;
                case "time": 
                    if (key) {
                        array.sort((a, b) => {
                            return new Date(a[key]) - new Date(b[key]);
                        });
                        return array;
                    };
                    array.sort((a, b) => {
                        return new Date(a) - new Date(b);
                    });
                    return array;
            };
        };
        if (towards === "decr") {
            switch (method) {
                case "number":
                    if (key) {
                        array.sort((a, b) => {
                            return b[key] - a[key];
                        });
                        return array;
                    };
                    array.sort((a, b) => {
                        return b - a;
                    })
                    return array;
                case "string":
                    if (key) {
                        array.sort((a, b) => {
                            return b[key].localeCompare(a[key]);
                        });
                        return array;
                    };
                    array.sort((a, b) => {
                        return b.localeCompare(a);
                    });
                    return array;
                case "time":
                    if (key) {
                        array.sort((a, b) => {
                            return new Date(b[key]) - new Date(a[key]);
                        });
                        return array;
                    };
                    array.sort((a, b) => {
                        return new Date(b) - new Date(a);
                    });
                    return array;
            };
        };
    };

    function selectTags(el) {
        const value = el.querySelector('.select-ctn-value span');
        const icons = el.querySelectorAll('.select-ctn-value__icon');
        const [iconDown, iconUp] = icons;
        const optionCtn = el.querySelector('.select-ctn-optionCtn');
        const options = el.querySelectorAll('.select-ctn-optionCtn__option');
        el.addEventListener('click', () => {
            optionCtn.classList.toggle('active');
            iconDown.classList.toggle('active');
            iconUp.classList.toggle('active');
        });
        options.forEach(option => {
            option.addEventListener('click', () => {
                el.querySelector('.select-ctn-optionCtn__option.active').classList.remove('active');
                option.classList.add('active');
                const activeEl = el.querySelector('.select-ctn-optionCtn__option.active');
                value.innerText = activeEl.innerText;
                value.setAttribute('type', activeEl.getAttribute('type'));
            });
        });
    };

    function removeElWhenBlur() {
        const arrEl = [
            { 
                el: '.container-right-filter__selectContainer .select.border', 
                remove: '.select-ctn-optionCtn.active', 
                handle: el1Handle 
            },
        ];
        window.addEventListener('click', (e) => {
            arrEl.forEach(item => {
                const { el, remove, handle } = item;
                X$(el) && removeElHandle(e, X$(el), remove, handle);
            });
        });
        // func children
        function removeElHandle(e, el, removeEl, moreHandle) {
            const arr = [];
            e.composedPath().forEach(parentEl => { parentEl === el && arr.push(el) });
            if (arr.length) return;
            if (el.querySelector(removeEl)) {
                el.querySelector(removeEl).classList.remove('active');
                moreHandle && moreHandle(el);
            };
        };
        // more handle
        function el1Handle(el) {
            const icons = el.querySelectorAll('.select-ctn-value__icon');
            icons.forEach(icon => { icon.classList.toggle('active') });
        };
    };

    function checkBoxTags(el) {
        const background = el.querySelector('.checkBoxCtn-checkBox-background'); 
        const icon = el.querySelector('i');
        el.addEventListener('click', () => {
            background.classList.toggle('active');
            icon.classList.toggle('active');
        });
    };

    function textGradient() {
        canvasAnimate();
        const titleContainer = X$('.container-left-content__header-background-titleContainer');
        const textTitle = titleContainer.querySelector('.header-background-titleContainer__title');
        const textOverlay = titleContainer.querySelector('.header-background-titleContainer__textOverlay');
        textOverlay.innerText = textTitle.innerText;

        // func children
        function canvasAnimate() {
            let c = document.getElementById('canv');
            let $ = c.getContext('2d');
            
            let col = function (x, y, r, g, b) {
                $.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                $.fillRect(x, y, 1, 1);
            }
            let R = function (x, y, t) {
                return (Math.floor(192 + 64 * Math.cos((x * x - y * y) / 300 + t)));
            }
            
            let G = function (x, y, t) {
                return (Math.floor(192 + 64 * Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300)));
            }
            
            let B = function (x, y, t) {
                return (Math.floor(192 + 64 * Math.sin(5 * Math.sin(t / 9) + ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100)));
            }
            
            let t = 0;
            
            let run = function () {
                console.log('ok')
                for (x = 0; x <= 35; x++) {
                    for (y = 0; y <= 35; y++) {
                        col(x, y, R(x, y, t), G(x, y, t), B(x, y, t));
                    }
                }
                t = t + 0.02;
            }
            canvasHandleRun = setInterval(run, 20);
        };
    };

    function zoomImg(els) {
        els.forEach((el, index) => { el.setAttribute('index', index) });
        els.forEach((el) => {
            el.onclick = () => {
                let result = `[index='${el.getAttribute('index')}']`;
                fancyboxHandle(null, result, 'default');
            };
        });
    };

    function cancelDropFile() {
        window.ondragover = (e) => {
            e.preventDefault();
        };
        window.ondrop = (e) => {
            e.preventDefault();
        };
    };

    function backToTopHandle() {
        const btn = X$('.backToTop-Btn');
        let delay;

        btn.onclick = () => {
            body.scrollIntoView({behavior: "smooth", block: "start"});
        };

        btn.onmouseenter = () => {
            clearTimeout(delay);
        };

        btn.onmouseleave = calc

        let b = 0;
        calc();
        document.addEventListener('scroll', calc);
        // func children
        function calc() {
            clearTimeout(delay);

            let a = window.scrollY;
            if (a > b) {
                if (a > 500) btn.classList.add('active');
            } else if (a < b) {
                a < 500 ? btn.classList.remove('active')
                : btn.classList.add('active');
            };
            b = a;

            delay = setTimeout(() => {
                btn.classList.remove('active');
            }, 5000);
        };
    };

    function start() {
        branchItemHandle();
        menuItemHandle();
        adminSignInHandle();
        getDataRoomToHandle();
        notFoundFormHandle();
        selectTags(X$('.container-right-filter__selectContainer .select.border'));
        removeElWhenBlur();
        checkBoxTags(X$('.checkBoxCtn'));
        cancelDropFile();
        backToTopHandle();
    };
    start();
}
window.addEventListener('DOMContentLoaded', initApp());

// function event global
function typePassword(_this) {
    if (_this.className === 'fa-solid fa-eye eye') {
        _this.parentElement.querySelector('input').setAttribute('type', 'text');
        _this.className = 'fa-solid fa-eye-low-vision eye';
        _this.parentElement.querySelector('input').focus();
        return;
    };
    _this.className = 'fa-solid fa-eye eye';
    _this.parentElement.querySelector('input').setAttribute('type', 'password');
    _this.parentElement.querySelector('input').focus();
};