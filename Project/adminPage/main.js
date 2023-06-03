function initApp() {
    const X$ = document.querySelector.bind(document);
    const X$$ = document.querySelectorAll.bind(document);
    const body = X$('body');
    const getTodo = async(url) => { return (await fetch(url)).json() };
    let isAdmin;
    let repeatCatchCheckInDeadLine;
    let id, url;

    async function getData() {
        const url1 = "http://localhost:3000/adminAcount";
        const url2 = "http://localhost:3000/account";
        const res1 = await getTodo(url1);
        const res2 = await getTodo(url2);
        const checkAcc1 = res1.find(item => item.online === true);
        const checkAcc2 = res2.find(item => item.online === true);

        if (checkAcc1) {
            X$("h1").innerText = "chế độ Admin";
            isAdmin = true;
            id = checkAcc1.id;
            url = url1;
            optionRenderHTML(isAdmin);
            renderHandle(isAdmin);
            logOutHandle(url, id);
            return;
        };
        if (checkAcc2) {
            X$("h1").innerText = "chế độ Quản Trị Viên";
            isAdmin = false;
            id = checkAcc2.id;
            url = url2;
            optionRenderHTML(isAdmin);
            renderHandle(isAdmin);
            logOutHandle(url, id);
            return;
        };
        window.close();
    };

    function renderHandle(isAdmin, ...args) {
        const [id, url] = args;
        const roomContainer = X$('.room-container');
        const navbar = X$('.navbar');
        navbar.style.top = 0;
        stickyElement(navbar, null, null, 2);
        navbarAnimateHandle();
        const option = X$('.option');
        optionBtnHandle(roomContainer, option, navbar, isAdmin);
        const li = option.querySelectorAll('.option li');
        showTitle(li);
        optionBranchAnimateHandle(40);
        renderRoomItems();
        removeElWhenBlur();
        // func children
        function navbarAnimateHandle() {
            const navItems = X$$(".navbar li");
            const activeNavBackground = X$(".navbar .navbar__activeBackground");
            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    const itemActive = X$(".navbar li.active");
                    itemActive.classList.remove("active");
                    item.classList.add("active");
                    activeNavItemsFunc(activeNavBackground, X$(".navbar li.active"))
                });
            });
            activeNavItemsFunc(activeNavBackground, X$(".navbar li.active"))
            // func children
            function activeNavItemsFunc(element, activeElement) {
                if (!activeElement) return;
                setTimeout(() => {
                    Object.assign(element.style, {
                        width: activeElement.offsetWidth + "px",
                        height: activeElement.offsetHeight + "px",
                        left: activeElement.offsetLeft + "px"
                    });
                }, 10);
            };
        };
        // remove unnecessary element
        X$('.content-copyNotifi') && X$('.content-copyNotifi').remove();
    };
    function optionBranchAnimateHandle(height) {
        const branchItemContainer = X$('header .branch__branch-item');
        const branchItems = X$$('header .branch__branch-item li:not(:first-child)');
        const firstChild = X$('header .branch__branch-item li:first-child');
        const activeElement = X$('header .branch__branch-item li.active');
        const activeBackground = X$('.branch__activeBackground');
        branchItemContainer.onmouseenter = () => { branchItemContainer.style.height = 'auto' };
        branchItemContainer.onmouseleave = () => { branchItemContainer.style.height = height + 'px' };
        branchItems.forEach(item => {
            item.addEventListener('click', () => {
                const active = X$('header .branch__branch-item li.active');
                active.classList.remove('active');
                item.classList.add('active');
                firstChild.innerText = item.innerText;
                firstChild.setAttribute('data-branch', item.getAttribute('data-branch'));
                activeBackgroundStyle(activeBackground, item);
                STORAGE('memory').set('branch', firstChild.getAttribute('data-branch'));
            });
        });
        activeBackgroundStyle(activeBackground, activeElement);
        STORAGE('memory').get('branch') && branchItems.forEach(item => { item.getAttribute('data-branch') === STORAGE('memory').get('branch') && item.click() });
        firstChild.classList.remove('hideText');
        // func children
        function activeBackgroundStyle(element, activeElement) {
            Object.assign(element.style, {
                width: activeElement.offsetWidth + 'px',
                height: activeElement.offsetHeight + 'px',
                top: activeElement.offsetTop + 'px'
            });
        };
    };
    async function renderRoomItems() {
        const url = `http://localhost:3000/roomList`;
        const res = await getTodo(url);
        renderByBranch(res);
        // func children
        function renderByBranch(res) {
            const branchItems = X$$('header .branch__branch-item li:not(:first-child)');
            const activeEl = X$('header .branch__branch-item li:not(:first-child).active');
            if (!activeEl) return;
            const branch = activeEl.getAttribute('data-branch');
            const data = res.filter(r => { return r.branch === branch });
            renderByNavbar(data);
            branchItems.forEach(item => {
                item.addEventListener('click', () => {
                    const branch = X$('header .branch__branch-item li:not(:first-child).active').getAttribute('data-branch');
                    const data = res.filter(r => { return r.branch === branch });
                    renderByNavbar(data);
                });
            });
        };
        function renderByNavbar(res) {
            const currentActive = X$('.navbar li.active');
            const status = currentActive.getAttribute('data-status');
            const navItems = X$$('.navbar li');
            filterArray(status);
            navItems.forEach(item => {
                item.onclick = () => {
                    const status = item.getAttribute('data-status');
                    filterArray(status);
                };
            });
            // func children
            function filterArray(status) {
                if (status === 'all') {
                    const data = res.filter(r => { return r.status });
                    renderBySearch(data, null);
                    return;
                } 
                const data = res.filter(r => { return r.status === status });
                renderBySearch(data, status)
            };
        };
        function renderBySearch(res, status) {
            const searchInput = X$('.option li.search input');
            const navItemBookedEl = X$('.navbar li[data-status="Đã đặt!"]');
            const navItemBooingEl = X$('.navbar li[data-status="Đang đặt!"]');
            const value = searchInput.value.trim();
            filterArray(value);
            searchInput.oninput = () => {
                const value = searchInput.value.trim();
                filterArray(value);
            };
            // func children
            function filterArray(value) {
                const data = res.filter(r => { 
                    if (r.roomName.toLowerCase().includes(value.toLowerCase())

                        || navItemBookedEl.classList.contains('active') 
                        && r.customerInformation && r.customerInformation.phoneNumber 
                        && r.customerInformation.phoneNumber.includes(value)

                        || navItemBookedEl.classList.contains('active') 
                        && r.customerInformation && r.customerInformation.name 
                        && r.customerInformation.name.toLowerCase().includes(value.toLowerCase())
                        
                        || navItemBookedEl.classList.contains('active') 
                        && r.customerInformation && r.customerInformation.email 
                        && r.customerInformation.email.toLowerCase().includes(value.toLowerCase())

                        || navItemBooingEl.classList.contains('active') 
                        && r.customerInformation && r.customerInformation.phoneNumber 
                        && r.customerInformation.phoneNumber.includes(value)

                        || navItemBooingEl.classList.contains('active') 
                        && r.customerInformation && r.customerInformation.email 
                        && r.customerInformation.email.toLowerCase().includes(value.toLowerCase())
                        ) {
                            
                        return r
                    };
                });
                renderBySort(data, status);
            };
        };
        function renderBySort(res, status) {
            const text = X$('.option li.sort .text');
            const attributes = text.getAttribute('data-sort');
            filterArray(attributes);
            const selectItems = X$$('.option li.sort .select .select-item');
            selectItems.forEach(item => {
                item.onclick = () => {
                    const attributes = item.getAttribute('data-sort');
                    filterArray(attributes);
                };
            });
            // func children
            function filterArray(attributes) {
                let data;
                switch (attributes) {
                    case 'default':
                        let arr1 = [...res];
                        data = arr1.filter(r => r);
                        break;
                    case 'a-z':
                        let arr2 = [...res];
                        data = sortLibary(arr2, 'string', 'incr', 'roomName');
                        break;
                    case 'popularity':
                        let arr3 = [...res];
                        data = sortLibary(arr3, 'number', 'decr', 'popularity');
                        break;
                    case 'new':
                        let arr4 = [...res];
                        data = sortLibary(arr4, 'time', 'decr', 'timeCreate');
                        break;
                    case 'lasted-update':
                        let arr5 = [...res];
                        data = sortLibary(arr5, 'time', 'decr', 'timeUpdate');
                        break;
                    case 'amount':
                        let arr6 = [...res];
                        data = sortLibary(arr6, 'number', 'incr', 'amount');
                        break;
                };
                renderByFilter(data, status);
            };
        };
        function renderByFilter(res, status) {
            renderByEmptyRooms(res, status);
            renderByRemoveChildElement(res, status);
            // func children
            function renderByEmptyRooms(res, status) {
                const emptyRoomElement = X$('.select-itemEmptyRoom');
                filterArray(emptyRoomElement);
                emptyRoomElement.onclick = () => { filterArray(emptyRoomElement) };
                // func children
                function filterArray(emptyRoomElement) {
                    let data;
                    emptyRoomElement.classList.contains('active') ?
                    data = res.filter(r => r.status === 'Đang trống!')
                    : data = res.filter(r => r.status);
                    renderByNormalRooms(data, status);
                };
            };
            function renderByNormalRooms(res, status) {
                const normalRoomElement = X$('.select-itemNormalRoom');
                filterArray(normalRoomElement);
                normalRoomElement.onclick = () => { filterArray(normalRoomElement) };
                // func children
                function filterArray(normalRoomElement) {
                    let data;
                    normalRoomElement.classList.contains('active') ?
                    data = res.filter(r => r.roomType === normalRoomElement.getAttribute('data-filter'))
                    : data = res.filter(r => r.roomType);
                    renderByPremierRooms(data, status);
                };
            };
            function renderByPremierRooms(res, status) {
                const premierRoomElement = X$('.select-itemPremierRoom');
                filterArray(premierRoomElement);
                premierRoomElement.onclick = () => { filterArray(premierRoomElement) };
                //  func children
                function filterArray(premierRoomElement) {
                    let data;
                    premierRoomElement.classList.contains('active') ? 
                    data = res.filter(r => r.roomType === premierRoomElement.getAttribute('data-filter'))
                    : data = res.filter(r => r.roomType);
                    renderHTMLroomItems(data, status);
                };
            };
            function renderByRemoveChildElement(res, status) {
                const optionItemChildContainer = X$('.option__item-childContainer');
                optionItemChildContainer.onclick = (e) => {
                    e.target.closest('.option__item-childContainer-child') && renderByEmptyRooms(res, status);
                };
            };
        };
        // remove unnecessary element
        X$('.loader') && loader('hide');
        X$('.notifi') && X$('.notifi').remove();
        X$('.overlay') && overlay('hide');
        X$('.bookRoomForm') && X$('.bookRoomForm').remove();
    };
    function renderHTMLroomItems(res, status) {
        const roomContainer = X$('.room-container');
        if (!status) {
            const result = res.filter(r => !r.isNotRoom)
            const htmls = result.map(data => {
                const { id, roomName, status, popularity, avatar, roomType, amount } = data;
                return `
                <div data-id="${id}" class="room-list__room-item">
                    <div style="background-image: url('${avatar}')" class="room-list__room-item-img"></div>
                    <i class="space"></i>
                    <div class="room-info">
                        <div style="width: 100%; border-bottom: 2px solid white" class="room-list__room-item__text-box">
                            <div class="content">
                                Tên phòng
                                <i data-text="Copy mã phòng" class="fa-sharp fa-solid fa-paste content-copyIcon"></i>
                            </div>
                            <div class="text room-name-text"><span>${roomName}</span></div>
                        </div>
                        <div style="width: 200px" class="room-list__room-item__text-box">
                            <span class="content">Trạng thái</span>
                            <span class="text text-flex">
                                <i class="${status === 'Đang trống!' && 'text-i--null'
                                || status === 'Đang đặt!' && 'text-i--booking'
                                || status === 'Đã đặt!' && 'text-i--booked'
                                || status === 'Đã nhận!' && 'text-i--received'}">
                                </i>
                                ${status}
                            </span>
                        </div>
                        <i class="space"></i>
                        <div style="--flex: 1" class="room-list__room-item__text-box">
                            <span class="content">Hạng phòng</span>
                            <span class="text">${roomType === 'normal' && 'Phổ thông'
                        || roomType === 'premier' && 'Cao cấp'}</span>
                        </div>
                        <i class="space"></i>
                        <div style="--flex: 1" class="room-list__room-item__text-box">
                            <span style="padding-left: 3px; padding-right: 3px;" class="content">Số người</span>
                            <span class="text">${amount}</span>
                        </div>
                        <i class="space"></i>
                        <div style="--flex: 1" class="room-list__room-item__text-box">
                            <span style="padding-left: 3px; padding-right: 3px;" class="content">Độ phổ biến</span>
                            <span class="text">${popularity}</span>
                        </div>
                    </div>
                    <i class="space"></i>
                    <div class="room-list__room-item__btn-container">
                        ${status === 'Đang trống!' && `
                        <div class="btn btn-container-receivedRoom btn-container-receivedRoomOffline">
                            <span>Nhận phòng</span><i class="fa-sharp fa-solid fa-building-circle-check"></i>
                        </div>
                        ` || ''}
                    ${isAdmin && `
                        <div class="btn edit"><span>Chỉnh sửa</span><i class="fa-light fa-pen-to-square"></i></div>
                        <div class="btn delete"><span>Xóa phòng</span><i class="fa-duotone fa-trash"></i></div>
                        ` || ''}
                    </div>
                </div>
                `;
            }).join('\n');
            roomContainer.innerHTML = `
            <div class="room-list">
                <span class="room-list__room-length">Có ${result.length} phòng.</span>
                ${htmls}
            </div>
            `;

            clearInterval(repeatCatchCheckInDeadLine);
        };
        if (status === 'Đang đặt!') {
            const htmls = res.map(data => {
                const { id, roomName, avatar, roomType, amount, customerInformation, isNotRoom } = data;
                return `
                <div data-id="${id}" class="room-list__room-item">
                    <div style="background-image: url('${avatar}')" class="room-list__room-item-img"></div>
                    <i class="space"></i>
                    <div class="room-info">
                        <div style="width: 100%; border-bottom: 2px solid white" class="room-list__room-item__text-box">
                            <div class="content">Tên phòng</div>
                            <div class="text room-name-text"><span>${roomName}</span></div>
                        </div>
                        <i class="space"></i>
                        <div style="--flex: 1" class="room-list__room-item__text-box">
                            <span class="content">Hạng phòng</span>
                            <span class="text">${roomType === 'normal' && 'Phổ thông'
                        || roomType === 'premier' && 'Cao cấp' || roomType}</span>
                        </div>
                        <i class="space"></i>
                        <div style="--flex: 1" class="room-list__room-item__text-box">
                            <span style="padding-left: 3px; padding-right: 3px;" class="content">Số người</span>
                            <span class="text">${amount}</span>
                        </div>
                        <i class="space"></i>
                        <div style="--flex: 2.5" class="room-list__room-item__text-box">
                            <span style="padding-left: 3px; padding-right: 3px;" class="content">Thông tin KH</span>
                            <div class="room-list__room-item__text-box-contentCtn">
                                <div class="text booked phone-numb-text">
                                    SĐT: &nbsp; <span>${customerInformation.phoneNumber}</span>
                                </div>
                                <div class="text booked email-text">
                                    Email: &nbsp; <span>${customerInformation.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <i class="space"></i>
                    <div class="room-list__room-item__btn-container">
                        <div data-isNotRoom="${isNotRoom && true || ''}" class="btn btn-container-bookRoomBtn">
                            <span>Đặt phòng</span><i class="fa-solid fa-money-check-dollar-pen"></i>
                        </div>
                        <div data-isNotRoom="${isNotRoom && true || ''}" class="btn btn-container-removeBtn">
                            <span>Gỡ bỏ</span><i class="fa-sharp fa-solid fa-store-slash"></i>
                        </div>
                    </div>
                </div>
                `;
            }).join('\n');
            roomContainer.innerHTML = `
            <div class="room-list">
                ${htmls}
            </div>
            `;

            clearInterval(repeatCatchCheckInDeadLine);
            hoverShowFullGuestInfo();
        };
        if (status === 'Đã đặt!') {
            let result;
            result = res.filter(r => !r.isNotRoom);
            const htmls = result.map(data => {
                const { id, roomName, avatar, roomType, amount, customerInformation, checkInDeadline } = data;

                let format;
                if (checkInDeadline) {
                    let formatDay;
                    let formatMonth;
                    const toArr = checkInDeadline.split(' ');
                    const [ date, time ] = toArr;
                    const arrToFormat = date.split('/');
                    const [ month, day, year ] = arrToFormat;
                    day < 10 ? formatDay = day.replace('0', '') : formatDay = day;
                    month < 10 ? formatMonth = month.replace('0', '') : formatMonth = month;
                    format = formatDay+','+'tháng '+formatMonth+','+year+' '+time;
                };

                return `
                <div data-id="${id}" class="room-list__room-item">
                    <div style="background-image: url('${avatar}')" class="room-list__room-item-img"></div>
                    <i class="space"></i>
                    <div class="room-info">
                        <div style="width: 100%; border-bottom: 2px solid white" class="room-list__room-item__text-box">
                            <div class="content">
                                Tên phòng
                                <div class="content-checkInDeadline">
                                    <i class="fa-regular fa-timer content-checkInDeadline-icon"></i> 
                                    <span class="content-checkInDeadline-timeContent">${checkInDeadline && format}</span>
                                    <i class="fa-solid fa-triangle-exclamation content-checkInDeadline-iconWarning hidden"></i>
                                </div>
                            </div>
                            <div class="text room-name-text"><span>${roomName}</span></div>
                        </div>
                        <i class="space"></i>
                        <div style="--flex: 1" class="room-list__room-item__text-box">
                            <span class="content">Hạng phòng</span>
                            <span class="text">${roomType === 'normal' && 'Phổ thông'
                        || roomType === 'premier' && 'Cao cấp' || roomType}</span>
                        </div>
                        <i class="space"></i>
                        <div style="--flex: 1" class="room-list__room-item__text-box">
                            <span style="padding-left: 3px; padding-right: 3px;" class="content">Số người</span>
                            <span class="text">${amount}</span>
                        </div>
                        <i class="space"></i>
                        <div style="--flex: 2.5" class="room-list__room-item__text-box">
                            <span style="padding-left: 3px; padding-right: 3px;" class="content">Thông tin KH</span>
                            <div class="room-list__room-item__text-box-contentCtn">
                                <div class="text booked phone-numb-text">
                                        SĐT: &nbsp; <span>${customerInformation.phoneNumber}</span>
                                </div>
                                <div class="text booked email-text">
                                    Email: &nbsp; <span>${customerInformation.email}</span>
                                </div>
                                <div class="text booked guestName-text">
                                    Tên: &nbsp; <span>${customerInformation.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <i class="space"></i>
                    <div class="room-list__room-item__btn-container">
                        <div class="btn btn-container-receivedRoom">
                            <span>Nhận phòng</span><i class="fa-sharp fa-solid fa-building-circle-check"></i>
                        </div>
                        <div data-isNotRoom="" class="btn btn-container-removeBtn">
                            <span>Gỡ bỏ</span><i class="fa-sharp fa-solid fa-store-slash"></i>
                        </div>
                    </div>
                </div>
                `;
            }).join('\n');

            roomContainer.innerHTML = `
            <div class="room-list">
                ${htmls}
            </div>
            `;

            catchCheckInDeadLine();
            hoverShowFullGuestInfo();
        };
        if (status === 'Đã nhận!') {
            const result = res.filter(r => !r.isNotRoom)
            const htmls = result.map(data => {
                const { id, roomName, avatar, roomType, amount } = data;
                return `
                <div data-id="${id}" class="room-list__room-item">
                    <div style="background-image: url('${avatar}')" class="room-list__room-item-img"></div>
                    <i class="space"></i>
                    <div class="room-info">
                        <div style="width: 100%; border-bottom: 2px solid white" class="room-list__room-item__text-box">
                            <span class="content">Tên phòng</span>
                            <div class="text room-name-text"><span>${roomName}</span></div>
                        </div>
                        <i class="space"></i>
                        <div style="--flex: 1" class="room-list__room-item__text-box">
                            <span class="content">Hạng phòng</span>
                            <span class="text">${roomType === 'normal' && 'Phổ thông'
                        || roomType === 'premier' && 'Cao cấp'}</span>
                        </div>
                        <i class="space"></i>
                        <div style="--flex: 1" class="room-list__room-item__text-box">
                            <span style="padding-left: 3px; padding-right: 3px;" class="content">Số người</span>
                            <span class="text">${amount}</span>
                        </div>
                    </div>
                    <i class="space"></i>
                    <div class="room-list__room-item__btn-container">
                    <div class="btn btn-customerInfo"><span>Khách hàng</span><i class="fa-duotone fa-users"></i></div>
                    <div class="btn btn-receipt"><span>Hóa đơn</span><i class="fa-light fa-receipt"></i></div>
                    <div class="btn btn-container-removeBtn"><span>Trả phòng</span><i class="fa-sharp fa-solid fa-house-person-return"></i></div>
                    </div>
                </div>
                `;
            }).join('\n');
            roomContainer.innerHTML = `
            <div class="room-list">
                ${htmls}
            </div>
            `;

            clearInterval(repeatCatchCheckInDeadLine);
        };

        roomItemsHandle();
        highlightTextSearch();

        // func children
        function highlightTextSearch() {
            const searchInput = X$('.option li.search input');
            searchInput.value.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
            let pattern = new RegExp(`${searchInput.value}`,"gi");
            const roomNames = X$$('.room-list__room-item__text-box .room-name-text span');
            const phoneNumbs = X$$('.room-list__room-item__text-box .phone-numb-text span');
            const guestNames = X$$('.room-list__room-item__text-box .guestName-text span');
            const email = X$$('.room-list__room-item__text-box .email-text span');
            const elmentList = [
                roomNames,
                phoneNumbs,
                guestNames,
                email,
            ];
            if (!searchInput.value || !searchInput.value.trim()) {
                elmentList.forEach(els => {
                    els.forEach(el => {
                        el.innerHTML = el.innerHTML.replace(/<mark>/g, '').replace(/<\/mark>/g, '');
                    });
                });
                return;
            };
            elmentList.forEach(els => {
                els.forEach(el => {
                    el.innerHTML = el.textContent.replace(pattern, match => `<mark>${match}</mark>`);
                });
            });
        };
        function catchCheckInDeadLine() {
            clearInterval(repeatCatchCheckInDeadLine);
            repeatCatchCheckInDeadLine = setInterval(() => {
                const roomItems = X$$('.room-list__room-item');
                if (roomItems.length) {
                    roomItems.forEach(roomItem => {
                        const contentCheckInDeadLine = roomItem.querySelector('.content-checkInDeadline');
                        const timeContentCheckInDeadLine = roomItem.querySelector('.content-checkInDeadline-timeContent');
                        if (!contentCheckInDeadLine) return;
                        const format = timeContentCheckInDeadLine.innerText.replace('tháng ', '').replace(/,/g, '/');
                        const checkInDeadline = new Date(format).getTime();
                        const currDate = new Date().getTime();
                        if (currDate > checkInDeadline) {
                            const iconWarning = roomItem.querySelector('.content-checkInDeadline-iconWarning');
                            if (!iconWarning.classList.contains('hidden')) return;
                            iconWarning.classList.remove('hidden');
                            timeContentCheckInDeadLine.style.background = 'rgb(226, 35, 35)';
                            timeContentCheckInDeadLine.style.color = 'white';
                        };
                    });
                };
            }, 500)
        };
        function hoverShowFullGuestInfo() {
            const roomItems = X$$('.room-list__room-item');
            const navItemBooked = X$('.navbar li[data-status="Đã đặt!"]');
            const navItemBooking = X$('.navbar li[data-status="Đang đặt!"]');
            if (navItemBooked.classList.contains('active') || navItemBooking.classList.contains('active')) {
                roomItems.forEach(roomItem => {
                    roomItem.onmouseenter = () => {
                        const guestInfoEl = roomItem.querySelector('.room-list__room-item__text-box-contentCtn');
                        const textBoxEl = guestInfoEl.closest('.room-list__room-item .room-list__room-item__text-box');
                        textBoxEl.style.maxHeight = textBoxEl.offsetHeight + 'px';
                        guestInfoEl.classList.add('active');
                    };
                    roomItem.onmouseleave = () => {
                        const guestInfoEl = roomItem.querySelector('.room-list__room-item__text-box-contentCtn');
                        const textBoxEl = guestInfoEl.closest('.room-list__room-item .room-list__room-item__text-box');
                        textBoxEl.style.maxHeight = 'unset';
                        guestInfoEl.classList.remove('active');
                    };
                });
            };
        };
    };

    function optionBtnHandle(container, element, ...params) {
        const optionSortSelect = element.querySelector('.option li.sort .select');
        const btnSort = element.querySelector('.option li.sort');
        const optionFilterSelect = element.querySelector('.option li.filter .select');
        const btnFilter = element.querySelector('.option li.filter');
        const btnAdd = element.querySelector('.option li.add');
        btnSort.onclick = () => {
            const span = btnSort.querySelector('span');
            optionSortSelect.classList.toggle('active');
            optionSortSelect.classList.contains('active') && span && span.remove();
        };
        btnFilter.onclick = () => {
            const span = btnFilter.querySelector('span');
            optionFilterSelect.classList.toggle('active');
            optionFilterSelect.classList.contains('active') && span && span.remove();
        };
        btnSortTitle();
        btnFilterAppendChild();
        if (btnAdd) btnAdd.onclick = () => { optionBtnAddHandle(container, element, ...params) };
        // func children
        function btnSortTitle() {
            const optionSortSelectItems = X$$('.option li.sort .select-item');
            const arrowEl = optionSortSelect.querySelector('i'); 
            arrowEl.onclick = (e) => { e.stopPropagation() };
            optionSortSelectItems.forEach(item => {
                item.addEventListener('click', () => {
                    const text = element.querySelector('.option li.sort .text');
                    const itemActive = element.querySelector('.option li.sort .select .select-item.active ');
                    text.innerText = item.innerText;
                    text.setAttribute('data-sort', item.getAttribute('data-sort'));
                    itemActive.classList.remove('active');
                    item.classList.add('active');
                });
            });
        };
        function btnFilterAppendChild() {
            const containerEl = X$('.option__item.filter');
            const childContainer = containerEl.querySelector('.option__item-childContainer');
            const optionFilterSelectItems = X$$('.option li.filter .select-item');
            optionFilterSelectItems.forEach(item => {
                item.addEventListener('click', () => {
                    const currentChilds = X$$('.option__item-childContainer-child');
                    item.classList.toggle('active');
                    if (!item.classList.contains('active')) {
                        currentChilds.forEach(child => {
                            child.getAttribute('data-filter') === item.getAttribute('data-filter') && child.remove();
                        });
                        return;
                    };
                    const child = document.createElement('span');
                    child.className = 'option__item-childContainer-child';
                    child.innerText = item.innerText;
                    child.setAttribute('data-filter', item.getAttribute('data-filter'));
                    childContainer.appendChild(child);
                    removeChild();
                });
            });
            removeChild();
            optionFilterSelect.onclick = (e) => { e.stopPropagation() };
            
            // func children
            function removeChild() {
                X$$('.option__item-childContainer-child').forEach(child => {
                    child.onclick = () => { 
                        child.remove();
                        const activeSelectItems = X$$('.option li.filter .select-item.active');
                        activeSelectItems.forEach(item => { 
                            item.getAttribute('data-filter') === child.getAttribute('data-filter') && item.classList.remove('active');
                        });
                    };
                });
            };
        };
    };
    function optionBtnAddHandle(container, element, ...params) {
        const [navbar, isAdmin, res] = params;
        const defaultHTML = body.innerHTML;
        const searchInput = X$('.option li.search input');
        const lastedValueOfSearchInput = searchInput.value.trim();
        container.innerHTML = `
        <form action="">
            <h1>Ảnh đại diện</h1>
            <div class="background-drop-zone">
                <div class="drop-zone">
                    <span style="display: ${res && 'none'|| 'block'}" class="drop-zone__prompt">Kéo thả ảnh hoặc nhấn vào đây</span>
                    <input type="file" class="drop-zone__input">
                    <img style="display: ${res && 'block' || 'none'};" 
                    data-img="${res && 'has-img' || 'no-img'}" 
                    src="${res && res.avatar || ''}" alt="">
                </div>
            </div>
            <div class="btn-removeImg ${res && 'active' || ''}">Gỡ ảnh xuống</div>

            <div class="box-input">
                <input value="${res && res.roomName || ''}" class="name box-input-inputItem" type="text" placeholder=" ">
                <div class="box-input-placeholderInput">
                    <span class="box-input-placeholderInput-text">Tên phòng</span>
                </div>
                <div class="box-input-line"></div>
            </div>
            <div class="box-input">
                <div class="background-textarea">
                    <textarea class="box-input-textarea" name="" id="" cols="30" rows="10" placeholder=" ">${res && res.roomDecription || ''}</textarea>
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Mô tả</span>
                    </div>
                </div>
            </div>
            <div class="box-input">
                <input value="${res && res.amount || ''}" class="amount box-input-inputItem" type="number" placeholder=" ">
                <div class="box-input-placeholderInput">
                    <span class="box-input-placeholderInput-text">Số lượng</span>
                </div>
                <div class="box-input-line"></div>
            </div>

            <br>
            <h1>Hình ảnh phòng</h1>
            <br>
            <div class="swiper-container">
                <div class="swiper swiperMain">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide default">
                            <img src="../img/logo.png" alt="">
                        </div>
                    </div>
                    <div class="swiper-pagination hidden"></div>
                </div>
                <div class="swiper-btn-next"><i class="fa-sharp fa-solid fa-caret-right"></i></div>
                <div class="swiper-btn-prev"><i class="fa-sharp fa-solid fa-caret-left"></i></div>
                <div class="swiper__btn-container">
                    <input type="file" class="hidden input-add-img">
                    <input type="file" class="hidden input-change-img">
                    <div data-text="Thêm ảnh" class="btn-swiper add-img"><i class="fa-light fa-plus"></i></div>
                    <p></p>
                    <div data-text="Xóa ảnh này" class="btn-swiper remove-img"><i class="fa-duotone fa-trash"></i></div>
                    <p></p>
                    <div data-text="Đổi ảnh khác" class="btn-swiper change-img"><i class="fa-regular fa-repeat"></i></div>
                    <p></p>
                    <div data-text="Phóng to" class="btn-swiper zoom-img"><i class="fa-light fa-magnifying-glass-plus"></i></div>
                </div>
                <div class="swiper-container-overlay">Kéo & thả ảnh vào đây</div>
            </div>

            <div class="branch">
                <h1>Chi nhánh</h1>
                <div class="branch-background">
                    <div data-branch="${res && res.branch || ''}" class="branch__select">
                        <div class="text">
                            <span>
                                ${res ? res.branch === 'HaNoi' && 'Hà Nội'
                                || res.branch === 'DaNang' && 'Đà Nẵng'
                                || 'TP HCM'
                                : '--Chọn chi nhánh--'}
                            </span>
                            <i class="fa-solid fa-square-chevron-down"></i>
                        </div>
                        <li data-branch="TP HCM">TP HCM</li>
                        <li data-branch="HaNoi">Hà Nội</li>
                        <li data-branch="DaNang">Đà Nẵng</li>
                    </div>
                </div>
            </div>

            <div class="convenient">
                <h1>Tiện nghi</h1>
                <div class="convenient-background">
                    <div data-type-room="${res && res.roomType || ''}" class="convenient__select">
                        <div class="text">
                            <span>
                                ${res ? res.roomType === 'normal' && 'Phổ thông' 
                                || res.roomType === 'premier' && 'Cao cấp'
                                : '--Hạng phòng--'}
                            </span>
                            <i class="fa-solid fa-square-chevron-down"></i>
                        </div>
                        <li data-type-room="normal">Phổ thông</li>
                        <li data-type-room="premier">Cao cấp</li>
                    </div>
                </div>

                <div class="convenient__container"></div>
            </div>

            <div class="footer">
                <div class="btn-container">
                    <div class="btn btn-save">Lưu</div>
                    <p></p>
                    <div class="btn btn-save-back">Lưu và trở về</div>
                </div>
            </div>
        </form>
        `;
        body.scrollIntoView({ behavior: "auto", block: "start" });
        element && element.remove();
        navbar && navbar.remove();
        X$('.branch') && X$('.branch').remove();
        res ? X$('header h1').innerText = 'Thông tin phòng' : X$('header h1').innerText = 'Thêm phòng mới';
        btnBackHandle();
        uploadFileHandle();
        textareaHandle();
        branchSelectHandle();
        convenientSelectHandle();
        btnSaveHandle();
        res && eventBtnRemoveAvatar();
        res && renderSwiperSlide();
        swiperFuncHandle();
        // func children
        function btnBackHandle() {
            const btnBack = X$('header .btn-back');
            btnBack.style.display = 'block';
            btnBack.onclick = () => {
                body.innerHTML = defaultHTML;
                const searchInput = body.querySelector('.option li.search input');
                searchInput.value = lastedValueOfSearchInput;
                defaultPageFunc(isAdmin);
                logOutHandle(url, id);
            };
        };
        function swiperFuncHandle() {
            // note:
            // swiper.addSlide(index, slides)
            // addSlide(1, '<div class="swiper-slide">Slide 10"</div>')
            // addSlide(1, [
            //  '<div class="swiper-slide">Slide 10"</div>',
            //  '<div class="swiper-slide">Slide 11"</div>'
            // ]);

            // swiper.removeSlide(slideIndex)
            // removeSlide(0); // remove first slide
            // removeSlide([0, 1]); // remove first and second slides

            // swiper.removeAllSlides()

            // swiper.appendSlide(slides) // append slide next
            // appendSlide('<div class="swiper-slide">Slide 10"</div>')
            // appendSlide([
            //  '<div class="swiper-slide">Slide 10"</div>',
            //  '<div class="swiper-slide">Slide 11"</div>'
            // ]);

            // swiper.prependSlide(slides) // append slide prev
            // prependSlide('<div class="swiper-slide">Slide 0"</div>')
            // prependSlide([
            //  '<div class="swiper-slide">Slide 1"</div>',
            //  '<div class="swiper-slide">Slide 2"</div>'
            // ]);
            const swiperMain = new Swiper(".swiperMain", {
                // slidesPerView: 3,
                // spaceBetween: 30,
                effect: "coverflow",
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: "auto",
                // autoplay: {
                //     delay: 1000,
                //     disableOnInteraction: false,
                // },
                // pauseOnMouseEnter: true,
                scale: 1.5,
                loop: false,
                // zoom: {
                //     maxRatio: 50,
                // },
                keyboard: {
                    enabled: true,
                    onlyInViewport: false,
                },
                // hashNavigation: true,
                // hashNavigation: {
                //     replaceState: true,
                // },
                // history: {
                //     replaceState: true,
                // },
                // a11y: {
                //     prevSlideMessage: 'Previous slide',
                //     nextSlideMessage: 'Next slide',
                // },
                speed: 300,
                coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                    scale: 0.8
                },
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                navigation: {
                    nextEl: "form .swiper-container .swiper-btn-next",
                    prevEl: "form .swiper-container .swiper-btn-prev",
                },
            });
            const container = X$('.swiper-container');
            const btnNext = container.querySelector('form .swiper-container .swiper-btn-next i');
            const btnPrev = container.querySelector('form .swiper-container .swiper-btn-prev i');
            swiperSlideClickEvent(container, btnNext, btnPrev);
            btnSwiperHandle(swiperMain, container);
            dropImgIntoSwiper(container, swiperMain)
                // func children
            function swiperSlideClickEvent(container, btnNext, btnPrev) {
                container.onclick = (e) => {
                    e.target.classList.contains('swiper-slide-prev') &&
                        btnPrev.click();
                    e.target.classList.contains('swiper-slide-next') &&
                        btnNext.click();
                };
            };
            function btnSwiperHandle(swiperMain, container) {
                const btnSwipers = container.querySelectorAll('.swiper__btn-container .btn-swiper');
                btnSwipers.forEach(btn => {
                    btn.onclick = () => {
                        // add-img
                        if (btn.classList.contains('add-img')) {
                            const input = container.querySelector('.swiper__btn-container .input-add-img');
                            input.click();
                            input.onchange = (e) => { addImgForSwiper(e.target, container, swiperMain) };
                        };
                        // remove-img
                        if (btn.classList.contains('remove-img')) {
                            const defaultSlide = container.querySelector('.swiper-slide.default');
                            if (defaultSlide) return;
                            removeImgForSwiper(container, swiperMain);
                        };
                        // change-img
                        if (btn.classList.contains('change-img')) {
                            const defaultSlide = container.querySelector('.swiper-slide.default');
                            if (defaultSlide) return;
                            const input = container.querySelector('.swiper__btn-container .input-change-img');
                            input.click();
                            input.onchange = (e) => { changeImgForSwiper(e.target, container, swiperMain) };
                        };
                        // zoom-img
                        if (btn.classList.contains('zoom-img')) {
                            const defaultSlide = container.querySelector('.swiper-slide.default');
                            if (defaultSlide) return;
                            zoomImgForSwiper(container);
                        };
                    };
                });
                showTitle(btnSwipers);
            };
            function addImgForSwiper(_this, ...args) {
                const [container, swiperMain] = args;
                const file = _this.files[0];
                const defaultSlide = container.querySelector('.swiper-slide.default');
                const index = container.querySelectorAll('.swiper-slide').length;
                const pagination = container.querySelector('.swiper-pagination');
                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        const html = `
                            <div class="swiper-slide">
                                <img src="${reader.result}" alt="">
                            </div>
                        `;
                        defaultSlide && swiperMain.removeAllSlides();
                        swiperMain.addSlide(index, html);
                        pagination.querySelector('.swiper-pagination-bullet:last-child').click();
                    };
                } else {
                    const html = `
                            <div class="swiper-slide">
                                <span><i class="fa-solid fa-image-slash"></i>
                                <br>File này không phải hình ảnh, vui lòng chọn một hình ảnh!</span>
                            </div>
                        `;
                    defaultSlide && swiperMain.removeAllSlides();
                    swiperMain.addSlide(index, html);
                    pagination.querySelector('.swiper-pagination-bullet:last-child').click();
                };
                _this.remove();
                const newInput = document.createElement('input');
                newInput.type = 'file';
                newInput.className = 'hidden input-add-img';
                container.querySelector('.swiper__btn-container').appendChild(newInput);
                newInput.onchange = (e) => { addImgForSwiper(e.target, container, swiperMain) };
            };
            function dropImgIntoSwiper(container, swiperMain) {
                const overlay = container.querySelector('form .swiper-container .swiper-container-overlay');
                const dropZoneElement = X$('form .drop-zone');
                let target = null;
                document.addEventListener('dragenter', (e) => {
                    target = e.target;
                    body.style.pointerEvents = 'none';
                    overlay.classList.add('active');
                });
                document.addEventListener('dragleave', (e) => {
                    if (e.target === X$('html')) {
                        if (target === overlay
                            || target === dropZoneElement) {
                            target = null;
                            return;
                        };
                        body.style.pointerEvents = 'all';
                        overlay.classList.remove('active');
                    };
                    if (e.target === overlay
                        || e.target === dropZoneElement) {
                        if (target === X$('html')) {
                            target = null;
                            return;
                        };
                        body.style.pointerEvents = 'all';
                        overlay.classList.remove('active');
                    };
                });
                document.addEventListener('drop', (e) => {
                    body.style.pointerEvents = 'all';
                    overlay.classList.remove('active');
                    if (e.target !== overlay) return;
                    const file = e.dataTransfer.files[0];
                    const defaultSlide = container.querySelector('.swiper-slide.default');
                    const index = container.querySelectorAll('.swiper-slide').length;
                    const pagination = container.querySelector('.swiper-pagination');
                    if (file.type.startsWith("image/")) {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => {
                            const html = `
                                <div class="swiper-slide">
                                    <img src="${reader.result}" alt="">
                                </div>
                            `;
                            defaultSlide && swiperMain.removeAllSlides();
                            swiperMain.addSlide(index, html);
                            pagination.querySelector('.swiper-pagination-bullet:last-child').click();
                        };
                    } else {
                        const html = `
                                <div class="swiper-slide">
                                    <span><i class="fa-solid fa-image-slash"></i>
                                    <br>File này không phải hình ảnh, vui lòng chọn một hình ảnh!</span>
                                </div>
                            `;
                        defaultSlide && swiperMain.removeAllSlides();
                        swiperMain.addSlide(index, html);
                        pagination.querySelector('.swiper-pagination-bullet:last-child').click();
                    };
                });
            };
            function removeImgForSwiper(container, swiperMain) {
                const slides = container.querySelectorAll('.swiper-slide');
                const arr = Array.from(slides);
                let getIndex;
                arr.find((item, index) => {
                    if (item.classList.contains('swiper-slide-active')) getIndex = index;
                });
                swiperMain.removeSlide(getIndex);
                if (container.querySelectorAll('.swiper-slide').length < 1) {
                    const html = `
                        <div class="swiper-slide default">
                            <img src="../img/logo.png" alt="">
                        </div>
                    `;
                    swiperMain.addSlide(0, html);
                };
            };
            function changeImgForSwiper(_this, ...args) {
                const [container, swiperMain] = args;
                const file = _this.files[0];
                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        const activeSlide = container.querySelector('.swiper-slide-active');
                        const img = activeSlide.querySelector('img');
                        img.src = reader.result;
                    };
                } else {
                    const activeSlide = container.querySelector('.swiper-slide-active');
                    activeSlide.innerHTML = `
                            <span><i class="fa-solid fa-image-slash"></i>
                            <br>File này không phải hình ảnh, vui lòng chọn một hình ảnh!</span>
                        `;
                };
                _this.remove();
                const newInput = document.createElement('input');
                newInput.type = 'file';
                newInput.className = 'hidden input-change-img';
                container.querySelector('.swiper__btn-container').appendChild(newInput);
                newInput.onchange = (e) => { changeImgForSwiper(e.target, container, swiperMain) };
            };
            function zoomImgForSwiper(container) {
                const activeSlide = container.querySelector('.swiper-slide-active');
                activeSlide.style.opacity = '0';
                overlay();
                const zoomedImg = document.createElement('div');
                zoomedImg.className = "zoomed-img";
                zoomedImg.innerHTML = activeSlide.innerHTML;
                body.appendChild(zoomedImg);
                Object.assign(zoomedImg.style, {
                    width: activeSlide.offsetWidth + "px",
                    height: activeSlide.offsetHeight + "px"
                });
                X$('.overlay').style.cursor = 'zoom-out';
                X$('.overlay').onclick = () => {
                    overlay('hide');
                    activeSlide.style.opacity = '1';
                    zoomedImg.remove();
                };
            };
        };
        function textareaHandle() {
            const textarea = container.querySelector('.box-input-textarea');
            textarea.onfocus = (e) => { e.target.parentElement.style.borderColor = 'transparent' };
            textarea.onblur = (e) => { e.target.parentElement.style.borderColor = 'black' };
            const height = textarea.offsetHeight + 'px';
            textarea.oninput = () => {
                textarea.style.height = height;
                textarea.style.height = textarea.scrollHeight + 'px';
            };
        };
        function branchSelectHandle() {
            const containerEl = container.querySelector('form .branch-background');
            const selectElement = container.querySelector('form .branch__select');
            const defaultText = container.querySelector('form .branch__select .text span');
            const optionItems = container.querySelectorAll('form .branch__select li');
            const icon = container.querySelector('form .branch__select .text i');
            containerEl.onclick = selectHandle;

            // func children
            function selectHandle() {
                selectElement.classList.toggle('active');
                icon.classList.contains('fa-square-chevron-down') 
                ? icon.className = "fa-solid fa-square-chevron-up" : icon.className = "fa-solid fa-square-chevron-down";
                optionItems.forEach(item => {
                    selectElement.getAttribute('data-branch') === item.getAttribute('data-branch')
                    && item.classList.add('active');
                    item.onclick = () => {
                        containerEl.querySelector('.branch__select li.active') 
                        && containerEl.querySelector('.branch__select li.active').classList.remove('active');
                        item.classList.add('active');
                        defaultText.innerText = item.innerText;
                        selectElement.setAttribute('data-branch', item.getAttribute('data-branch'));
                    };
                });
            }
        };
        function convenientSelectHandle() {
            const containerEl = container.querySelector('form .convenient-background');
            const selectElement = container.querySelector('form .convenient__select');
            const defaultText = container.querySelector('form .convenient__select .text span');
            const optionItems = container.querySelectorAll('form .convenient__select li');
            const icon = container.querySelector('form .convenient__select .text i');
            const convenientContainer = container.querySelector('form .convenient__container');
            renderConvenientContent();
            containerEl.onclick = selectHandle;

            // func children
            function selectHandle() {
                selectElement.classList.toggle('active');
                icon.classList.contains('fa-square-chevron-down') 
                ? icon.className = "fa-solid fa-square-chevron-up" : icon.className = "fa-solid fa-square-chevron-down";
                optionItems.forEach(item => {
                    selectElement.getAttribute('data-type-room') === item.getAttribute('data-type-room') 
                    && item.classList.add('active');
                    item.onclick = () => {
                        containerEl.querySelector('.convenient__select li.active') 
                        && containerEl.querySelector('.convenient__select li.active').classList.remove('active');
                        item.classList.add('active');
                        defaultText.innerText = item.innerText;
                        selectElement.setAttribute('data-type-room', item.getAttribute('data-type-room')); 
                        renderConvenientContent();
                    };
                });
            };
            function renderConvenientContent() {
                if (!selectElement.getAttribute('data-type-room')) return;
                if (selectElement.getAttribute('data-type-room') === 'normal') {
                    convenientContainer.innerHTML = `
                    <div class="convenient__container__content">
                        <div class="convenient__container__content-header">
                            <img src="../svg-link/giuong-ngu.svg" alt="">
                            <span>Trang bị trong phòng</span>
                        </div>
                        <div class="convenient__container__content-body grid wide">
                            <div class="row">
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/ao-tam.svg" alt="">
                                        <span>Áo choàng tắm</span>
                                    </li>
                                </div>
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/hop-tien-nghi.svg" alt="">
                                        <span>Hộp tiện nghi</span>
                                    </li>
                                </div>
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/khay-tra.svg" alt="">
                                        <span>Khay trà</span>
                                    </li>
                                </div>
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/bien-bao-cam-hut-thuoc.svg" alt="">
                                        <span>Biển báo cấm hút thuốc</span>
                                    </li>
                                </div>
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/the-tu-khoa-phong.svg" alt="">
                                        <span>Thẻ từ khóa phòng</span>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="convenient__container__content">
                        <div class="convenient__container__content-header">
                            <img src="../svg-link/thu-gian.svg" alt="">
                            <span>Thư giãn & vui chơi giải trí</span>
                        </div>
                        <div class="convenient__container__content-body grid wide">
                            <div class="row">
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/san-vuon.svg" alt="">
                                        <span>Sân vườn</span>
                                    </li>
                                </div>
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/yoga.svg" alt="">
                                        <span>KIN Fitness & Yoga</span>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="convenient__container__content">
                        <div class="convenient__container__content-header">
                            <img src="../svg-link/an-uong.svg" alt="">
                            <span>Ăn uống</span>
                        </div>
                        <div class="convenient__container__content-body grid wide">
                            <div class="row">
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/nha-hang.svg" alt="">
                                        <span>Sân vườn</span>
                                    </li>
                                </div>
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/bar&coffee.svg" alt="">
                                        <span>KIN Fitness & Yoga</span>
                                    </li>
                                </div>
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/pint-beer.svg" alt="">
                                        <span>PINT BEER</span>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="convenient__container__content">
                        <div class="convenient__container__content-header">
                            <img src="../svg-link/league.svg" alt="">
                            <span>Ngôn ngữ sử dụng</span>
                        </div>
                        <div class="convenient__container__content-body grid wide">
                            <div class="row">
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/vietnam's-flag.svg" alt="">
                                        <span>Tiếng Việt</span>
                                    </li>
                                </div>
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/british-flag.svg" alt="">
                                        <span>Tiếng Anh</span>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="convenient__container__content">
                        <div class="convenient__container__content-header">
                            <img src="../svg-link/nguoi-khuyet-tat.svg" alt="">
                            <span>Khả năng tiếp cận cho người khuyết tật</span>
                        </div>
                        <div class="convenient__container__content-body grid wide">
                            <div class="row">
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/thang-may.svg" alt="">
                                        <span>Thang máy</span>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="convenient__container__content">
                        <div class="convenient__container__content-header">
                            <img src="../svg-link/dich-vu.svg" alt="">
                            <span>Dịch vụ</span>
                        </div>
                        <div class="convenient__container__content-body grid wide">
                            <div class="row">
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/ket-an-toan.svg" alt="">
                                        <span>Két an toàn</span>
                                    </li>
                                </div>
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/nuoc-dong-chai-free.svg" alt="">
                                        <span>Nước đóng chai miễn phí</span>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="convenient__container__content">
                        <div class="convenient__container__content-header">
                            <img src="../svg-link/san-bay.svg" alt="">
                            <span>Sân bay lân cận</span>
                        </div>
                        <div class="convenient__container__content-body grid wide">
                            <div class="row">
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/san-bay-Lien-Khuong.svg" alt="">
                                        <span>Sân bay Liên Khương (DLI)</span>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="convenient__container__content">
                        <div class="convenient__container__content-header">
                            <img src="../svg-link/di-lai.svg" alt="">
                            <span>Đi lại</span>
                        </div>
                        <div class="convenient__container__content-body grid wide">
                            <div class="row">
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/bai-dau-xe.svg" alt="">
                                        <span>Bãi đậu xe</span>
                                    </li>
                                </div>
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/san-bay-Lien-Khuong.svg" alt="">
                                        <span>Đưa đón sân bay</span>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="convenient__container__content">
                        <div class="convenient__container__content-header">
                            <img src="../svg-link/internet.svg" alt="">
                            <span>Truy cập internet</span>
                        </div>
                        <div class="convenient__container__content-body grid wide">
                            <div class="row">
                                <div class="col l-4">
                                    <li>
                                        <img src="../svg-link/wifi.svg" alt="">
                                        <span>Wifi nơi công cộng</span>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    return;
                };
                convenientContainer.innerHTML = `
                <div class="convenient__container__content">
                    <div class="convenient__container__content-header">
                        <img src="../svg-link/giuong-ngu.svg" alt="">
                        <span>Trang bị trong phòng</span>
                    </div>
                    <div class="convenient__container__content-body grid wide">
                        <div class="row">
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/tivi.svg" alt="">
                                    <span>Tivi</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/tu-lanh.svg" alt="">
                                    <span>Tủ lạnh</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/hop-so-cuu.svg" alt="">
                                    <span>Hộp sơ cứu</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/dien-thoai-ban.svg" alt="">
                                    <span>Điện thoại bàn</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/may-say-toc.svg" alt="">
                                    <span>Máy sấy tóc</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/am-dun-nuoc.svg" alt="">
                                    <span>Ấm đun nước</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/moc-ao-co-kep.svg" alt="">
                                    <span>Móc áo có kẹp</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/moc-ao-khong-co-kep.svg" alt="">
                                    <span>Móc áo không có kẹp</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/nem-gap-gon.svg" alt="">
                                    <span>Nệm gấp gọn</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/ao-tam.svg" alt="">
                                    <span>Áo choàng tắm</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/dep-trong-phong.svg" alt="">
                                    <span>Dép trong phòng</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/ly-thuy-tinh-cao.svg" alt="">
                                    <span>Ly thủy tinh cao</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/ly-uong-tra.svg" alt="">
                                    <span>Ly uống trà</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/dia-lot-ly.svg" alt="">
                                    <span>Đĩa lót ly</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/muong-coffee.svg" alt="">
                                    <span>Muỗng uống cà phê</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/hop-khan-giay.svg" alt="">
                                    <span>Hộp khăn giấy</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/khay.svg" alt="">
                                    <span>Khay</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/guong-trang-diem.svg" alt="">
                                    <span>Gương trang điểm</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/rem-toi-mau.svg" alt="">
                                    <span>Rèm tối màu</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/rem-voan.svg" alt="">
                                    <span>Rèm voan</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/de-ly.svg" alt="">
                                    <span>Đế ly</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/hop-tien-nghi.svg" alt="">
                                    <span>Hộp tiện nghi</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/khay-tra.svg" alt="">
                                    <span>Khay trà</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/cua-kinh-phong-tam.svg" alt="">
                                    <span>Cửa kính phòng tắm</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/gia-de-khan.svg" alt="">
                                    <span>Giá để khăn</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/ghe.svg" alt="">
                                    <span>Ghế</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/nem-bao-ve.svg" alt="">
                                    <span>Nệm bảo vệ</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/guong-trong-phong-tam.svg" alt="">
                                    <span>Gương trong phòng tắm</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/goi.svg" alt="">
                                    <span>Gối</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/ga-trai-giuong.svg" alt="">
                                    <span>Ga trải giường</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/vo-chan.svg" alt="">
                                    <span>Vỏ chăn</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/vo-goi.svg" alt="">
                                    <span>Vỏ gối</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/chan_men.svg" alt="">
                                    <span>Chăn mền</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/den-ngu.svg" alt="">
                                    <span>Đèn ngủ</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/goi-trang-tri.svg" alt="">
                                    <span>Gối trang trí</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/nem-ghe-dai.svg" alt="">
                                    <span>Nệm ghế dài</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/khan-tam.svg" alt="">
                                    <span>Khăn tắm</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/khan-mat.svg" alt="">
                                    <span>Khăn mặt</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/khan-tay.svg" alt="">
                                    <span>Khăn tay</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/tham-tam.svg" alt="">
                                    <span>Thảm tắm</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/bon-rua.svg" alt="">
                                    <span>Bồn rửa</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/bon-ve-sinh.svg" alt="">
                                    <span>Bồn vệ sinh</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/nem.svg" alt="">
                                    <span>Nệm</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/bien-bao-cam-hut-thuoc.svg" alt="">
                                    <span>Biển báo cấm hút thuốc</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/the-tu-khoa-phong.svg" alt="">
                                    <span>Thẻ từ khóa phòng</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/guong-trang-diem-nho.svg" alt="">
                                    <span>Gương trang điểm nhỏ</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/can.svg" alt="">
                                    <span>Cân</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/den-doc-sach.svg" alt="">
                                    <span>Đèn đọc sách</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/ban-tra.svg" alt="">
                                    <span>Bàn trà</span>
                                </li>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="convenient__container__content">
                    <div class="convenient__container__content-header">
                        <img src="../svg-link/thu-gian.svg" alt="">
                        <span>Thư giãn & vui chơi giải trí</span>
                    </div>
                    <div class="convenient__container__content-body grid wide">
                        <div class="row">
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/san-vuon.svg" alt="">
                                    <span>Sân vườn</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/yoga.svg" alt="">
                                    <span>KIN Fitness & Yoga</span>
                                </li>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="convenient__container__content">
                    <div class="convenient__container__content-header">
                        <img src="../svg-link/an-uong.svg" alt="">
                        <span>Ăn uống</span>
                    </div>
                    <div class="convenient__container__content-body grid wide">
                        <div class="row">
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/bua-sang.svg" alt="">
                                    <span>Bữa sáng</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/nha-hang.svg" alt="">
                                    <span>Nhà hàng</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/bar&coffee.svg" alt="">
                                    <span>The Lobby bar&coffee</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/pint-beer.svg" alt="">
                                    <span>PINT BEER</span>
                                </li>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="convenient__container__content">
                    <div class="convenient__container__content-header">
                        <img src="../svg-link/league.svg" alt="">
                        <span>Ngôn ngữ sử dụng</span>
                    </div>
                    <div class="convenient__container__content-body grid wide">
                        <div class="row">
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/vietnam's-flag.svg" alt="">
                                    <span>Tiếng Việt</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/british-flag.svg" alt="">
                                    <span>Tiếng Anh</span>
                                </li>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="convenient__container__content">
                    <div class="convenient__container__content-header">
                        <img src="../svg-link/nguoi-khuyet-tat.svg" alt="">
                        <span>Khả năng tiếp cận cho người khuyết tật</span>
                    </div>
                    <div class="convenient__container__content-body grid wide">
                        <div class="row">
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/thang-may.svg" alt="">
                                    <span>Thang máy</span>
                                </li>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="convenient__container__content">
                    <div class="convenient__container__content-header">
                        <img src="../svg-link/dich-vu.svg" alt="">
                        <span>Dịch vụ</span>
                    </div>
                    <div class="convenient__container__content-body grid wide">
                        <div class="row">
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/ket-an-toan.svg" alt="">
                                    <span>Két an toàn</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/nuoc-dong-chai-free.svg" alt="">
                                    <span>Nước đóng chai miễn phí</span>
                                </li>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="convenient__container__content">
                    <div class="convenient__container__content-header">
                        <img src="../svg-link/san-bay.svg" alt="">
                        <span>Sân bay lân cận</span>
                    </div>
                    <div class="convenient__container__content-body grid wide">
                        <div class="row">
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/san-bay-Lien-Khuong.svg" alt="">
                                    <span>Sân bay Liên Khương (DLI)</span>
                                </li>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="convenient__container__content">
                    <div class="convenient__container__content-header">
                        <img src="../svg-link/di-lai.svg" alt="">
                        <span>Đi lại</span>
                    </div>
                    <div class="convenient__container__content-body grid wide">
                        <div class="row">
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/bai-dau-xe.svg" alt="">
                                    <span>Bãi đậu xe</span>
                                </li>
                            </div>
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/san-bay-Lien-Khuong.svg" alt="">
                                    <span>Đưa đón sân bay</span>
                                </li>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="convenient__container__content">
                    <div class="convenient__container__content-header">
                        <img src="../svg-link/internet.svg" alt="">
                        <span>Truy cập internet</span>
                    </div>
                    <div class="convenient__container__content-body grid wide">
                        <div class="row">
                            <div class="col l-4">
                                <li>
                                    <img src="../svg-link/wifi.svg" alt="">
                                    <span>Wifi nơi công cộng</span>
                                </li>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            };
        };
        function btnSaveHandle() {
            const inputElement = container.querySelector('.box-input input.name');
            const inputAmount = container.querySelector('.box-input input.amount');
            const textareaElement = container.querySelector('.box-input-textarea');
            const convenientSelectElement = container.querySelector('form .convenient__select');
            const branchSelectElement = container.querySelector('form .branch__select');
            const btnContainer = container.querySelector('form .footer .btn-container');
            inputElement.addEventListener('input', checkRequired);
            inputAmount.addEventListener('input', checkRequired);
            textareaElement.addEventListener('input', checkRequired);
            convenientSelectElement.addEventListener('click', checkRequired);
            branchSelectElement.addEventListener('click', checkRequired);
            checkRequired();
            // func children
            function checkRequired() {
                if (inputElement.value.trim() == ''
                    || textareaElement.value.trim() == ''
                    || inputAmount.value.trim() == ''
                    || inputAmount.value.trim() < 1
                    || !convenientSelectElement.getAttribute('data-type-room')
                    || !branchSelectElement.getAttribute('data-branch')) {
                    btnContainer.classList.remove('active');
                    btnContainer.onclick = () => {};
                    return;
                };
                btnContainer.classList.add('active');
                btnContainer.onclick = (e) => { saveHandle(e.target, inputElement, textareaElement, convenientSelectElement, branchSelectElement) };
                // func children
                function saveHandle(_this, ...args) {
                    const url = 'http://localhost:3000/roomList';
                    const [ inputElement, textareaElement, convenientSelectElement, branchSelectElement ] = args;
                    const img = container.querySelector('form .drop-zone img');
                    const swiperSlides = container.querySelectorAll('form .swiper .swiper-slide');
                    const date = new Date();
                    const getImgSrc = [];
                    swiperSlides.forEach(item => {
                        if (!item.querySelector('img') || item.classList.contains('default')) {
                            getImgSrc.push('data:image/png;base64,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');
                            return;
                        }; 
                        getImgSrc.push(item.querySelector('img').src);
                    });
                    const obj = {};
                    obj.avatar = [];
                    img.getAttribute('data-img') === 'no-img' 
                    ? obj.avatar.push('data:image/png;base64,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') 
                    : obj.avatar.push(img.src);
                    obj.roomName = inputElement.value.trim();
                    obj.roomDecription = textareaElement.value.trim();
                    obj.amount = Number(inputAmount.value.trim());
                    obj.roomType = convenientSelectElement.getAttribute('data-type-room');
                    obj.imgReview = getImgSrc;
                    obj.branch = branchSelectElement.getAttribute('data-branch');
                    if (!res) obj.status = "Đang trống!";
                    if (!res) obj.popularity = 0;
                    if (!res) obj.timeCreate = date.getMonth()+1 + '/' + date.getDate() + '/' + date.getFullYear()
                    + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                    obj.timeUpdate = date.getMonth()+1 + '/' + date.getDate() + '/' + date.getFullYear()
                    + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                    if (_this.closest('form .footer .btn-container .btn-save')) {
                        overlayHidden();
                        if (res) {
                            const id = res.id;
                            usingFetch('PATCH', url + '/' + id, obj)
                                .then(() => {
                                    const successIconAnimateContainer = document.createElement('div');
                                    successIconAnimateContainer.className = 'success-icon-animate-container';
                                    successIconAnimateContainer.innerHTML = `
                                        <video autoplay muted>
                                            <source src="../animate-icon/sucess-icon.mp4" type="video/mp4">
                                            Trình duyệt này không hỗ trợ video
                                        </video>
                                        <span>Đã lưu!</span>
                                    `;
                                    body.appendChild(successIconAnimateContainer);
                                    const span = X$('.success-icon-animate-container span');
                                    span.addEventListener('animationend', () => {
                                        overlayHidden('hide');
                                        successIconAnimateContainer.remove();
                                    });
                                })
                            return;
                        };
                        usingFetch('POST', url, obj)
                            .then(() => {
                                const successIconAnimateContainer = document.createElement('div');
                                successIconAnimateContainer.className = 'success-icon-animate-container';
                                successIconAnimateContainer.innerHTML = `
                                    <video autoplay muted>
                                        <source src="../animate-icon/sucess-icon.mp4" type="video/mp4">
                                        Trình duyệt này không hỗ trợ video
                                    </video>
                                    <span>Đã lưu!</span>
                                `;
                                body.appendChild(successIconAnimateContainer);
                                const span = X$('.success-icon-animate-container span');
                                span.addEventListener('animationend', () => {
                                    overlayHidden('hide');
                                    successIconAnimateContainer.remove();
                                });
                            })
                        return;
                    };
                    if (res) {
                        const id = res.id;
                        usingFetch('PATCH', url + '/' + id, obj)
                            .then(() => {
                                const btnBack = X$('header .btn-back');
                                btnBack.click();
                            })
                        return;
                    };
                    usingFetch('POST', url, obj)
                        .then(() => {
                            const btnBack = X$('header .btn-back');
                            btnBack.click();
                        })
                };
            };   
        };
        // only run when has res
        function eventBtnRemoveAvatar() {
            const btnDeleteImg = X$('form .btn-removeImg');
            const img = X$('form .drop-zone img');
            const prompt = X$('form .drop-zone__prompt');
            btnDeleteImg.onclick = (e) => {
                if (img.src) {
                    img.src = '';
                    img.style.display = 'none';
                    img.setAttribute('data-img', 'no-img');
                };
                prompt.style.display = 'block';
                btnDeleteImg.classList.remove('active');
            };
        };
        function renderSwiperSlide() {
            const srcs = res.imgReview;
            const swiperWrapper = X$('form .swiper-wrapper');
            const slides = srcs.map(src => `
                <div class="swiper-slide">
                    <img src="${src}" alt="">
                </div>
            `).join('');
            swiperWrapper.innerHTML = slides;
        };
    };
    function optionRenderHTML(isAdmin) {
        const element = X$('.option');
        element.innerHTML = `
        <ul class="option__item option__item--itemTop">
        <li class="sort" data-text="Sắp xếp theo">
            <i class="fa-solid fa-bars-sort"></i>
            <div data-sort="default" class="text">Mặc định</div>
            <div class="select">
                <i></i>
                <div data-sort="default" class="select-item active">Mặc định</div>
                <div data-sort="a-z" class="select-item">A-Z</div>
                <div data-sort="popularity" class="select-item">Độ phổ biến</div>
                <div data-sort="new" class="select-item">Mới nhất</div>
                <div data-sort="lasted-update" class="select-item">Cập nhật gần đây</div>
                <div data-sort="amount" class="select-item">Số người</div>
            </div>
        </li>
        <li class="search" data-text="Tìm kiếm">
            <i class="fa-regular fa-magnifying-glass"></i>
            <div class="background"><input placeholder="Tìm kiếm phòng..." type="text"></div> 
        </li>
        ${isAdmin && `<li class="add" data-text="Thêm phòng mới"><i class="fa-light fa-plus"></i></li>
                    <li class="manage" data-text="Quản lý tài khoản"><i class="fa-regular fa-file-invoice"></i></li>`
            || ``
        }
        </ul>
        <ul class="option__item filter option__item--itemBottom">
            <li class="filter" data-text="Lọc theo">
                <i style="color: rgb(24, 138, 141)" class="fa-duotone fa-grid-2"></i>
                <div class="select">
                    <i style="transform: unset; left: 10px;"></i>
                    <div data-filter="empty" class="select-item select-itemEmptyRoom">Đang trống</div>
                    <div data-filter="normal" class="select-item select-itemNormalRoom">Phổ thông</div>
                    <div data-filter="premier" class="select-item select-itemPremierRoom">Cao cấp</div>
                </div>
            </li>
            <div class="option__item-childContainer"></div>
        </ul>
    `;
    };

    function roomItemsHandle() {
        const roomItems = X$$('.room-list__room-item');
        const url = 'http://localhost:3000/roomList';
        roomItems.forEach(item => {
            const editBtn = item.querySelector('.room-list__room-item__btn-container .btn.edit');
            const deleteBtn = item.querySelector('.room-list__room-item__btn-container .btn.delete');
            const removeBtn = item.querySelector('.btn-container-removeBtn');
            const bookRoomBtn = item.querySelector('.btn-container-bookRoomBtn');
            const copyIcon = item.querySelector('.content .content-copyIcon');
            const receivedRoomBtn = item.querySelector('.btn-container-receivedRoom');
            const btnCustomerInfo = item.querySelector('.btn-customerInfo');
            const btnReceipt = item.querySelector('.btn-receipt');
            if (editBtn) editBtn.onclick = () => { editBtnsHandle(item) };
            if (deleteBtn) deleteBtn.onclick = () => { deleteBtnsHandle(item) };
            if (removeBtn) removeBtn.onclick = () => { removeBtnHandle(item, removeBtn) };
            if (bookRoomBtn) bookRoomBtn.onclick = () => { bookRoomBtnsHandle(item, bookRoomBtn) };
            if (copyIcon) copyIcon.onclick = () => { copyRoomCodesHandle(item) };
            if (receivedRoomBtn) receivedRoomBtn.onclick = () => { receivedRoomBtnsHandle(item, receivedRoomBtn) };
            if (btnCustomerInfo) btnCustomerInfo.onclick = () => { customerInfoHandle(item) };
            if (btnReceipt) btnReceipt.onclick = () => { receiptHandle(item) };
        });
        // func children
        async function editBtnsHandle(item) {
            const id = item.getAttribute('data-id');
            const roomContainer = X$('.room-container');
            const option = X$('.option');
            const navbar = X$('.navbar');
            const res = await getTodo(url + '/' + id);
            optionBtnAddHandle(roomContainer, option, navbar, isAdmin, res);
        };
        function deleteBtnsHandle(item) {
            const id = item.getAttribute('data-id');
            const roomName = item.querySelector('.room-list__room-item .room-list__room-item__text-box .text');
            const title = `Xóa phòng ${roomName.innerText} ?`;
            createNotifiElement(title);
            const btnCancel = X$('.notifi-btnContainer-btnItem.btn--cancel');
            const btnConfirm = X$('.notifi-btnContainer-btnItem.btn--confirm');
            btnCancel.onclick = () => {
                X$('.notifi').remove();
                overlay('hide');
            };
            btnConfirm.onclick = () => {
                loader();
                usingFetch('DELETE', url + '/' + id)
                    .then(renderRoomItems)
            };
        };
        function removeBtnHandle(item, removeBtn) {
            const id = item.getAttribute('data-id');
            if (removeBtn.getAttribute('data-isNotRoom')) {
                const title = `Gỡ bỏ phòng này ?`;
                createNotifiElement(title);
                const btnCancel = X$('.notifi-btnContainer-btnItem.btn--cancel');
                const btnConfirm = X$('.notifi-btnContainer-btnItem.btn--confirm');
                btnCancel.onclick = () => {
                    X$('.notifi').remove();
                    overlay('hide');
                };
                btnConfirm.onclick = () => {
                    loader();
                    usingFetch('DELETE', url + '/' + id)
                        .then(renderRoomItems)
                };
                return;
            };
            const roomName = item.querySelector('.room-list__room-item .room-list__room-item__text-box .text');
            const title = `Trả phòng ${roomName.innerText} ?`;
            createNotifiElement(title);
            const btnCancel = X$('.notifi-btnContainer-btnItem.btn--cancel');
            const btnConfirm = X$('.notifi-btnContainer-btnItem.btn--confirm');
            btnCancel.onclick = () => {
                X$('.notifi').remove();
                overlay('hide');
            };
            btnConfirm.onclick = () => {
                const objData = {};
                objData.status = 'Đang trống!';
                objData.customerInformation = {
                    "phoneNumber": null,
                    "amount": null,
                    "IDcard": null,
                    "name": null,
                    "email": null,
                };
                objData.checkInTime = null;
                objData.checkInDeadline = null;
                objData.payment = null;
                loader();
                usingFetch('PATCH', url + '/' + id, objData)
                    .then(() => {
                        renderRoomItems();
                    })
            };
        };
        function bookRoomBtnsHandle(item, bookRoomBtn) {
            const idElement = item.getAttribute('data-id');
            const roomName = item.querySelector('.room-list__room-item .room-list__room-item__text-box .room-name-text span').innerText;
            const guestInfoContentCtn = item.querySelector('.room-list__room-item__text-box-contentCtn');
            const guestInfoItemEls = guestInfoContentCtn.querySelectorAll('.text.booked span');
            const [ spanPhoneNumb, spanEmail ] = guestInfoItemEls;
            const phoneNumb = spanPhoneNumb.innerText;
            const email = spanEmail.innerText;
            if (bookRoomBtn.getAttribute('data-isNotRoom')) {
                const form = createBookRoomForm('isNotRoom', 'Đặt phòng', phoneNumb, email);
                const timeNow = new Date();
                const minDate = `${timeNow.getFullYear()}-${timeNow.getMonth()+1}-${timeNow.getDate()}`;
                let checkInDeadline;
                const inputDateTime = X$('.bookRoomForm-date-picker');
                if (inputDateTime) {
                    const config = {
                        enableTime: true,
                        dateFormat: "Y/m/d H:i",
                        minDate: minDate,
                        time_24hr: true,
                        onClose: (e) => {
                            if (!e[0]) return;
                            const time = e[0];
                            checkInDeadline = getDateString(time);
                        }
                    };
                    flatpickr('.bookRoomForm-date-picker', config);
                };
                const inputItems = form.querySelectorAll('.box-input-inputItem');
                const inputRoomCode = form.querySelector('.box-input-inputItem.roomCode');
                const inputGuestName = form.querySelector('.box-input-inputItem.guestName');
                const inputPhoneNumb = form.querySelector('.box-input-inputItem.phoneNumb');
                const inputEmail = form.querySelector('.box-input-inputItem.email');
                const btnCancel = form.querySelector('.bookRoomForm-btnContainer-btnItem.btn--cancel');
                const btnConfirm = form.querySelector('.bookRoomForm-btnContainer-btnItem.btn--confirm');
                iconWarningAnimate(form, btnConfirm);
                btnCancel.onclick = () => {
                    X$('.bookRoomForm').remove();
                    overlay('hide');
                };
                btnConfirm.onclick = isNotRoomHandle;

                // func children
                function isNotRoomHandle() {
                    const catchRequired = [];
                    const notifi = X$('.bookRoomForm-notifi');
                    inputItems.forEach(input => {
                        input.onfocus = () => {
                            notifi.classList.add('hidden');
                        };
                        X$('.bookRoomForm-date-picker').onclick = () => {
                            notifi.classList.add('hidden');
                        };
                        if (input.value.trim() === '') catchRequired.push(input.value.trim());
                    });
                    if (!checkInDeadline && !catchRequired.length) {
                        notifi.innerText = 'Thiếu hạn nhận phòng!';
                        notifi.classList.remove('hidden');
                    };
                    !checkInDeadline && catchRequired.push(checkInDeadline);
                    if (catchRequired.length) return;
                    loader();
                    getCurrentDataToHandle();
                    // func children
                    async function getCurrentDataToHandle() {
                        const currentRes = await getTodo(url + '/' + idElement);
                        const guestName = inputGuestName.value.trim();
                        const phoneNumb = inputPhoneNumb.value.trim();
                        const email = inputEmail.value.trim();
                        const currentData = currentRes.customerInformation;
                        const objData = {};
                        objData.status = 'Đã đặt!';
                        objData.payment = {
                            amountOfMoney: '200000',
                            unit: 'VND',
                        };
                        objData.customerInformation = {
                            ...currentData,
                            name: guestName,
                            phoneNumber: phoneNumb,
                            email: email,
                        };
                        objData.checkInDeadline = checkInDeadline;
                        checkRoomIDtoHandle(objData);
                    };
                    async function checkRoomIDtoHandle(objData) {
                        const id = inputRoomCode.value.trim();
                        const roomRes = await getTodo(url + '/' + id);
                        if (roomRes.id) { 
                            if (roomRes.status !== 'Đang trống!') {
                                notifi.innerText = 'Phòng này đã được đặt!';
                                notifi.classList.remove('hidden');
                                loader('hide');
                                return;
                            };
                            usingFetch('PATCH', url + '/' + id, objData)
                            .then(async() => { return await usingFetch('DELETE', url + '/' + idElement) })
                            .then(renderRoomItems)
                            return;
                        };
                        loader('hide');
                        notifi.innerText = 'Mã phòng không đúng!';
                        notifi.classList.remove('hidden');
                    };
                };
                return;
            };  

            // is room
            const form = createBookRoomForm('book-room','Đặt phòng ' + roomName, phoneNumb, email);
            const timeNow = new Date();
            const minDate = `${timeNow.getFullYear()}-${timeNow.getMonth()+1}-${timeNow.getDate()}`;

            let checkInDeadline;
            const inputDateTime = X$('.bookRoomForm-date-picker');
            if (inputDateTime) {
                const config = {
                    enableTime: true,
                    dateFormat: "Y/m/d H:i",
                    minDate: minDate,
                    time_24hr: true,
                    onClose: (e) => {
                        if (!e[0]) return;
                        const time = e[0];
                        checkInDeadline = getDateString(time);
                    }
                };
                flatpickr('.bookRoomForm-date-picker', config);
            };

            const inputItems = form.querySelectorAll('.box-input-inputItem');
            const inputGuestName = form.querySelector('.box-input-inputItem.guestName');
            const inputPhoneNumb = form.querySelector('.box-input-inputItem.phoneNumb');
            const inputEmail = form.querySelector('.box-input-inputItem.email');
            const btnCancel = X$('.bookRoomForm-btnContainer-btnItem.btn--cancel');
            const btnConfirm = X$('.bookRoomForm-btnContainer-btnItem.btn--confirm');
            iconWarningAnimate(X$('.bookRoomForm'), btnConfirm);

            btnCancel.onclick = () => {
                X$('.bookRoomForm').remove();
                overlay('hide');
            };
            
            btnConfirm.onclick = isRoomHandle;

            // func children
            function isRoomHandle() {
                const catchRequired = [];
                const notifi = X$('.bookRoomForm-notifi');
                inputItems.forEach(input => {
                    input.onfocus = () => { notifi.classList.add('hidden') };
                    X$('.bookRoomForm-date-picker').onclick = () => { notifi.classList.add('hidden') };
                    if (input.value.trim() === '') catchRequired.push(input.value.trim());
                });

                if (!checkInDeadline && !catchRequired.length) {
                    notifi.innerText = 'Thiếu hạn nhận phòng!';
                    notifi.classList.remove('hidden');
                };
                !checkInDeadline && catchRequired.push(checkInDeadline);
                if (catchRequired.length) return;

                loader();
                getDataToPatch(); 

                // func children
                async function getDataToPatch() {
                    const res = await getTodo(url + '/' + idElement);
                    const currentData = res.customerInformation;
                    const guestName = inputGuestName.value.trim();
                    const phoneNumb = inputPhoneNumb.value.trim();
                    const email = inputEmail.value.trim();
                    const objData = {};

                    objData.status = 'Đã đặt!';
                    objData.payment = {
                        amountOfMoney: '200000',
                        unit: 'VND',
                    };
                    objData.customerInformation = {
                        ...currentData,
                        name: guestName,
                        phoneNumber: phoneNumb,
                        email: email,
                    };
                    objData.checkInDeadline = checkInDeadline;

                    usingFetch('PATCH', url + '/' + idElement, objData)
                        .then(renderRoomItems);
                };
            };
        };
        function copyRoomCodesHandle(item) {
            const id = item.getAttribute('data-id');
            const titleElement = item.querySelector('.room-list__room-item .room-list__room-item__text-box .content');
            navigator.clipboard.writeText(id);
            const copyNotifi = document.createElement('p');
            copyNotifi.className = 'content-copyNotifi';
            copyNotifi.innerText = 'Đã copy mã phòng!';
            titleElement.appendChild(copyNotifi);
            setTimeout(() => { copyNotifi.remove() }, 1500);
        };
        function receivedRoomBtnsHandle(item, receivedRoomBtn) {
            const id = item.getAttribute('data-id');
            const roomName = item.querySelector('.room-list__room-item .room-list__room-item__text-box .room-name-text').innerText;
            
            const guestInfoContentCtn = item.querySelector('.room-list__room-item__text-box-contentCtn');
            let guestInfoItemEls;
            if (guestInfoContentCtn) guestInfoItemEls = guestInfoContentCtn.querySelectorAll('.text.booked span');
            let phoneNumb;
            let email;
            let guestName;
            if (guestInfoItemEls) {
                const [ spanPhoneNumb, spanEmail, spanGuestName ] = guestInfoItemEls;
                phoneNumb = spanPhoneNumb.innerText;
                email = spanEmail.innerText;
                guestName = spanGuestName.innerText;
            };
            
            let form;
            const isReceivedRoomOffline = receivedRoomBtn.classList.contains('btn-container-receivedRoomOffline');
            isReceivedRoomOffline ? form = createBookRoomForm('received-room-offline','Nhận phòng ' + roomName) 
            : form = createBookRoomForm('received-room', 'Nhận phòng ' + roomName, phoneNumb, email, guestName);

            const inputItems = form.querySelectorAll('.box-input-inputItem');
            const btnCancel = form.querySelector('.bookRoomForm-btnContainer-btnItem.btn--cancel');
            const btnConfirm = form.querySelector('.bookRoomForm-btnContainer-btnItem.btn--confirm');

            iconWarningAnimate(form, btnConfirm);
            
            btnCancel.onclick = () => {
                X$('.bookRoomForm').remove();
                overlay('hide');
            };

            btnConfirm.onclick = () => {
                const catchErr = [];
                inputItems.forEach(input => { if (input.value.trim() === '') catchErr.push(input.value.trim()) });
                if (catchErr.length) return;

                loader();
                !isReceivedRoomOffline && receivedRoomHandle();
                isReceivedRoomOffline && receivedRoomOfflineHandle();

                // func children
                async function receivedRoomHandle() {
                    const res = await getTodo(url + '/' + id);
                    const inputGuestName = form.querySelector('.box-input-inputItem.guestName');
                    const inputPhoneNumb = form.querySelector('.box-input-inputItem.phoneNumb');
                    const inputIDcard = form.querySelector('.box-input-inputItem.IDcard');
                    const inputEmail = form.querySelector('.box-input-inputItem.email');
                    const inputGuestAmount = form.querySelector('.box-input-inputItem.guestAmount');

                    const guestName = inputGuestName.value.trim();
                    const phoneNumb = inputPhoneNumb.value.trim();
                    const IDcard = inputIDcard.value.trim();
                    const email = inputEmail.value.trim();
                    const guestAmount = inputGuestAmount.value.trim();

                    const time = new Date();
                    const date = time.getMonth()+1 + '/' + time.getDate() + '/' + time.getFullYear()
                    + ' ' + time.getHours() + ':' + time.getMinutes();
                    const objData = {};
                    objData.customerInformation = {
                        ...res.customerInformation,
                        phoneNumber: phoneNumb,
                        amount: guestAmount,
                        IDcard: IDcard,
                        name: guestName,
                        email: email,
                    };
                    objData.status = 'Đã nhận!';
                    objData.popularity = res.popularity + 1;
                    objData.checkInDeadline = null;
                    objData.checkInTime = date;
                    usingFetch('PATCH', url + '/' + id, objData)
                        .then(renderRoomItems)
                };

                async function receivedRoomOfflineHandle () {
                    const res = await getTodo(url + '/' + id);
                    const inputGuestName = form.querySelector('.box-input-inputItem.guestName');
                    const inputPhoneNumb = form.querySelector('.box-input-inputItem.phoneNumb');
                    const inputIDcard = form.querySelector('.box-input-inputItem.IDcard');
                    const inputGuestAmount = form.querySelector('.box-input-inputItem.guestAmount');

                    const guestName = inputGuestName.value.trim();
                    const phoneNumb = inputPhoneNumb.value.trim();
                    const IDcard = inputIDcard.value.trim();
                    const guestAmount = inputGuestAmount.value.trim();

                    const time = new Date();
                    const date = time.getMonth()+1 + '/' + time.getDate() + '/' + time.getFullYear()
                    + ' ' + time.getHours() + ':' + time.getMinutes();

                    const objData = {};
                    objData.customerInformation = {
                        phoneNumber: phoneNumb,
                        amount: guestAmount,
                        IDcard: IDcard,
                        name: guestName,
                    };
                    objData.status = 'Đã nhận!';
                    objData.popularity = res.popularity + 1;
                    objData.checkInDeadline = null,
                    objData.checkInTime = date;

                    usingFetch('PATCH', url + '/' + id, objData)
                        .then(renderRoomItems)
                };
            };
        };
        function customerInfoHandle(item) {
            const id = item.getAttribute('data-id');
            getDataToHandle();

            // func children
            async function getDataToHandle() {
                const res = await getTodo(url + '/' + id);
                const { name, phoneNumber, IDcard, amount, email } = res.customerInformation;

                let form;
                const title = 'Thông tin khách hàng';
                res.payment ? form = createBookRoomForm('received-room', title)
                : form = createBookRoomForm('received-room-offline', title);

                const btnCancel = X$('.bookRoomForm-btnContainer-btnItem.btn--cancel');
                const btnConfirm = X$('.bookRoomForm-btnContainer-btnItem.btn--confirm');

                iconWarningAnimate(X$('.bookRoomForm'), btnConfirm);

                btnCancel.innerText = 'Đóng';
                btnConfirm.innerText = 'Lưu lại';

                btnCancel.onclick = () => {
                    X$('.bookRoomForm').remove();
                    overlay('hide');
                };

                const inputs = X$$('.bookRoomForm .box-input-inputItem');
                const inputGuestName = form.querySelector('.box-input-inputItem.guestName');
                const inputPhoneNumb = form.querySelector('.box-input-inputItem.phoneNumb');
                const inputIDcard = form.querySelector('.box-input-inputItem.IDcard');
                const inputEmail = form.querySelector('.box-input-inputItem.email');
                const inputGuestAmount = form.querySelector('.box-input-inputItem.guestAmount'); 

                if (inputGuestName) inputGuestName.value = name;
                if (inputPhoneNumb) inputPhoneNumb.value = phoneNumber;
                if (inputIDcard) inputIDcard.value = IDcard;
                if (inputEmail) inputEmail.value = email;
                if (inputGuestAmount) inputGuestAmount.value = amount;

                inputs.forEach(input => { input.focus(); input.blur() });

                btnConfirm.onclick = () => {
                    let inputValueGuestName;
                    let inputValuePhoneNumb;
                    let inputValueIDcard;
                    let inputValueEmail;
                    let inputValueGuestAmount;
                    if (inputGuestName) inputValueGuestName = inputGuestName.value.trim();
                    if (inputPhoneNumb) inputValuePhoneNumb = inputPhoneNumb.value.trim();
                    if (inputIDcard) inputValueIDcard = inputIDcard.value.trim();
                    if (inputEmail) inputValueEmail = inputEmail.value.trim();
                    if (inputGuestAmount) inputValueGuestAmount = inputGuestAmount.value.trim();

                    const catchErr = [];
                    inputs.forEach(input => { if (input.value.trim() === '') catchErr.push(input.value.trim()) });
                    if (catchErr.length) return;

                    loader();

                    const objData = {};
                    objData.customerInformation = {
                        phoneNumber: inputValuePhoneNumb,
                        amount: inputValueGuestAmount,
                        IDcard: inputValueIDcard,
                        name: inputValueGuestName,
                    };
                    if (inputValueEmail) objData.customerInformation.email = inputValueEmail;

                    usingFetch('PATCH', url + '/' + id, objData)
                        .then(() => { 
                            loader('hide');
                            btnCancel.click();
                        })
                };
            };
        };
        function receiptHandle(item) {
            const id = item.getAttribute('data-id');
            getDateToHandle();

            // func children
            async function getDateToHandle() {
                const res = await getTodo(url + '/' + id);
                const checkInTime = new Date(res.checkInTime);
                const currDate = new Date();
                const oneHour = 3600000;
                const usedTime = Math.floor((currDate.getTime() - checkInTime.getTime())/oneHour);
                const roomTypeData = res.roomType;
                const branchData = res.branch;
                const currDateString = currDate.getDate()+', Tháng '+Number(currDate.getMonth()+1)
                                    +', '+currDate.getFullYear()+' '+currDate.getHours()
                                    +':'+currDate.getMinutes();
                const checkInTimeFormat = checkInTime.getDate()+', Tháng '+Number(checkInTime.getMonth()+1)
                                    +', '+checkInTime.getFullYear()+' '+checkInTime.getHours()
                                    +':'+checkInTime.getMinutes();
                let payment;
                let getAmountOfMoney;
                if (res.payment) {
                    const { amountOfMoney, unit } = res.payment;
                    if (amountOfMoney && unit) payment = new Intl.NumberFormat().format(amountOfMoney) + ' ' + unit;
                    getAmountOfMoney = amountOfMoney;
                };
                let branch;
                let roomType;
                let price;
                let calc;
                let usedPrice;
                let servicePrice = 200000;
                switch (roomTypeData) {
                    case 'premier':
                        roomType = 'Cao Cấp';
                        price = 30000;
                        calc = usedTime * price;
                        if (calc < 300000) calc = 300000;
                        usedPrice = calc;
                        if (payment) calc = calc - Number(getAmountOfMoney);
                        intoMoney = calc + servicePrice;
                        break;
                    case 'normal':
                        roomType = 'Phổ Thông';
                        price = 20000;
                        calc = usedTime * price;
                        if (calc < 200000) calc = 200000;
                        usedPrice = calc;
                        if (payment) calc = calc - Number(getAmountOfMoney);
                        intoMoney = calc + servicePrice;
                        break;
                };
                switch (branchData) {
                    default:
                        branch = branchData;
                        break;
                    case 'HaNoi': 
                        branch = 'Hà Nội';
                        break;
                    case 'DaNang':
                        branch = 'Đà Nẵng';
                        break;
                };
                servicePrice = new Intl.NumberFormat().format(servicePrice) + ' VND';
                usedPrice = new Intl.NumberFormat().format(usedPrice) + ' VND';
                price = new Intl.NumberFormat().format(price) + ' VND' + '/' + 'giờ';
                intoMoney = new Intl.NumberFormat().format(intoMoney) + ' VND';
                const arrData = [
                    res.customerInformation.name,
                    res.customerInformation.IDcard,
                    res.customerInformation.phoneNumber,
                    res.customerInformation.amount,
                    res.customerInformation.email,
                    res.roomName,
                    price,
                    roomType,
                    branch,
                    checkInTimeFormat,
                    usedTime + 'giờ' + ` (${Math.floor(usedTime/24)} ngày ${usedTime%24} giờ)`,
                    intoMoney,
                    currDateString,
                    payment,
                    usedPrice,
                    servicePrice
                ];
                createReceiptForm(...arrData);
                const btnCancel = X$('.receiptForm-btnContainer-btnItem.btn--cancel');
                const btnConfirm = X$('.receiptForm-btnContainer-btnItem.btn--confirm');
                btnCancel.onclick = () => {
                    X$('.receiptForm').remove();
                    overlay('hide');
                };
                btnConfirm.onclick = () => {
                    let element = X$('.receiptForm');
                    X$('.receiptForm-btnContainer').style.display = 'none';
                    htmlToImage.toPng(element)
                        .then(function (dataUrl) {
                            const a = document.createElement('a');
                            a.download = "Hoa_Don.png"
                            a.href = dataUrl;
                            a.click();
                            a.remove();
                            X$('.receiptForm-btnContainer').style.display = 'flex';
                        })
                        .catch(function (error) {
                            console.log('Lỗi rồi nè:', error);
                        });
                };
            };

            function createReceiptForm(...args) {
                const [ name, IDcard, phoneNumber, amount, email, roomName, price, roomType, branch, checkInTime, realUsedTime, 
                    intoMoney, currDateString, payment, usedPrice, servicePrice ] = args;
                const receiptForm = document.createElement('div');
                receiptForm.className = 'receiptForm-parent center';
                receiptForm.innerHTML = `
                    <div class="receiptForm">
                        <div class="receiptForm-header">
                            <img src="data:image/png;base64,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" 
                            alt="" class="receiptForm-header-img">
                            <div class="receiptForm-header-title">KIN - KHÁCH SẠN VIỆT NAM</div>
                        </div>
                        <div class="receiptForm-body">
                            <span class="receiptForm-timeCreate">${currDateString}</span>
                            <div class="receiptForm-body-info">
                                <div class="receiptForm-body-info-title">Thông tin khách hàng:</div>
                                <span class="receiptForm-body-info-content">
                                    - Tên khách hàng: ${name} <br>
                                    - Số CCCD: ${IDcard} <br>
                                    - Số điện thoại: ${phoneNumber} <br>
                                    - Địa chỉ email: ${email} <br>
                                    - Số lượng khách: ${amount} <br>
                                </span>
                            </div>
                            <div class="receiptForm-body-info">
                                <div class="receiptForm-body-info-title">Thông tin phòng:</div>
                                <span class="receiptForm-body-info-content">
                                    - Tên phòng: ${roomName} <br>
                                    - Giá: ${price} <br>
                                    - Hạng phòng: ${roomType} <br>
                                    - Chi nhánh: ${branch} <br>
                                </span>
                            </div>
                            <div class="receiptForm-body-info">
                                <div class="receiptForm-body-info-title">Tổng kết:</div>
                                <span class="receiptForm-body-info-content">
                                    ${payment && `
                                    - Hình thức đặt phòng: online <br>
                                    ` || `
                                    - Hình thức đặt phòng: offline <br>
                                    `}
                                    - Thời gian nhận phòng: ${checkInTime} <br>
                                    - Thời gian sử dụng: ${realUsedTime} <br>
                                    - Phí dịch vụ: ${servicePrice} <br>
                                    - Phí thuê phòng: ${usedPrice} <br>
                                    ${payment && `
                                    - Đã thanh toán: ${payment} <br>
                                    ` || ''}
                                </span>
                            </div>
                            <div class="receiptForm-body-info">
                                <div class="receiptForm-body-info-title">Thanh toán:</div>
                                <span class="receiptForm-body-info-content">
                                    - Thành tiền: ${intoMoney}
                                </span>
                            </div>
                        </div>
                        <div class="receiptForm-btnContainer">
                            <div class="receiptForm-btnContainer-btnItem btn--cancel">Đóng</div>
                            <div class="receiptForm-btnContainer-btnItem btn--confirm">Xuất hóa đơn</div>
                        </div>
                    </div>
                `;
                overlay();
                body.appendChild(receiptForm);
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

    function uploadFileHandle() {
        const btnDeleteImg = X$('form .btn-removeImg');
        const backgroundDropZoneElement = X$('.room-container form .background-drop-zone');
        document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
            const dropZoneElement = inputElement.closest(".drop-zone");
            dropZoneElement.onclick = () => {
                inputElement.click();
            };
            inputElement.addEventListener("change", () => {
                if (inputElement.files.length) {
                    updateThumbnail(dropZoneElement, inputElement.files[0], inputElement);
                };
            });
            dropZoneElement.addEventListener("dragover", (e) => {
                e.preventDefault();
                dropZoneElement.classList.add("drop-zone--over");
                backgroundDropZoneElement.style.borderColor = 'transparent';
            });
            ["dragleave", "dragend"].forEach((type) => {
                dropZoneElement.addEventListener(type, () => {
                    dropZoneElement.classList.remove("drop-zone--over");
                    backgroundDropZoneElement.style.borderColor = 'white';
                });
            });
            dropZoneElement.addEventListener("drop", (e) => {
                e.preventDefault();
                if (e.dataTransfer.files.length) {
                    inputElement.files = e.dataTransfer.files;
                    updateThumbnail(dropZoneElement, e.dataTransfer.files[0], inputElement);
                }
                dropZoneElement.classList.remove("drop-zone--over");
                backgroundDropZoneElement.style.borderColor = 'white';
            });
        });
        function updateThumbnail(dropZoneElement, file, inputElement) {
            let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");
            const img = dropZoneElement.querySelector("img");
            btnDeleteImg.classList.add('active');

            // First time - remove the prompt
            if (dropZoneElement.querySelector(".drop-zone__prompt")) {
                dropZoneElement.querySelector(".drop-zone__prompt").style.display = 'none';
            };

            // First time - there is no thumbnail element, so lets create it
            if (!thumbnailElement) {
                thumbnailElement = document.createElement("div");
                thumbnailElement.classList.add("drop-zone__thumb");
                dropZoneElement.appendChild(thumbnailElement);
            };
            thumbnailElement.dataset.label = file.name;

            // Show thumbnail for image files
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    img.src = reader.result;
                    img.setAttribute("data-img", "has-img");
                    img.style.display = 'block';
                };
                thumbnailElement.style.backgroundColor = 'unset';
            } else {
                thumbnailElement.style.backgroundColor = '#cccccc';
                img.src = '';
                img.style.display = 'none';
                img.setAttribute("data-img", "no-img");
            };
            btnDeleteImg.onclick = (e) => {
                thumbnailElement && thumbnailElement.remove();
                if (img.src) {
                    img.src = '';
                    img.style.display = 'none';
                    img.setAttribute("data-img", "no-img");
                }
                dropZoneElement.querySelector(".drop-zone__prompt").style.display = 'block';
                btnDeleteImg.classList.remove('active');

                inputElement.remove();
                const newInput = document.createElement('input');
                newInput.type = 'file';
                newInput.className = 'drop-zone__input';
                dropZoneElement.appendChild(newInput);

                dropZoneElement.onclick = () => {
                    newInput.click();
                };
                newInput.addEventListener("change", () => {
                    if (newInput.files.length) {
                        updateThumbnail(dropZoneElement, newInput.files[0], newInput);
                    };
                });
            };
        };
    };

    function cancelDropFile() {
        window.ondragover = (e) => {
            e.preventDefault();
        };
        window.ondrop = (e) => {
            e.preventDefault();
        };
    };

    function showTitle(element) {
        element.forEach(item => {
            const OldTitle = item.querySelector('span');
            OldTitle && OldTitle.remove();
            item.onmouseenter = () => {
                if (item.querySelector('.option li.sort .select.active')
                || item.querySelector('.option li.filter .select.active')) return;
                const title = document.createElement('span');
                title.innerText = item.getAttribute('data-text');
                item.appendChild(title);
                item.onmouseleave = () => { title.remove() };
            };
        });
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

    function overlayHidden(action) {
        if (action === 'hide') {
            document.querySelector('.overlay-hidden').remove();
            return;
        };
        if (document.querySelector('.overlay-hidden')) return;
        const element = document.createElement('div');
        element.className = 'overlay-hidden';
        document.body.appendChild(element);
    };

    function loader(action) {
        if (action === 'hide') {
            document.querySelector('.loader').remove();
            return;
        };
        const element = document.createElement('div');
        element.className = 'loader center';
        element.innerHTML = `
            <div class="loader__ring"></div>
            <span>loading...</span>
        `;
        document.body.appendChild(element);
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

    function createNotifiElement(title) {
        const createNotifi = document.createElement('div');
        createNotifi.className = 'notifi';
        createNotifi.innerHTML = `
            <div class="notifi">
                <span class="notifi-content">${title}</span>
                <div class="notifi-btnContainer">
                    <div class="notifi-btnContainer-btnItem btn--cancel">Hủy</div>
                    <div class="notifi-btnContainer-btnItem btn--confirm">Xác nhận</div>
                </div>
            </div>
        `;
        overlay();
        X$('.overlay').appendChild(createNotifi);
    };
    
    function createBookRoomForm(type, title, ...args) {
        const bookRoomForm = document.createElement('div');
        const [ phoneNumb, email, guestName ] = args;
        bookRoomForm.className = 'bookRoomForm center';

        if (type === 'isNotRoom') {
            bookRoomForm.innerHTML = `
                <div class="bookRoomForm-title">${title && title || ''}</div>
                <div class="box-input">
                    <input class="box-input-inputItem roomCode" type="text" placeholder=" ">
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Mã phòng</span>
                        <i class="fa-solid fa-triangle-exclamation box-input-placeholderInput__iconWarning"></i>
                    </div>
                    <div class="box-input-line"></div>
                </div>

                <div class="box-input">
                    <input class="box-input-inputItem guestName" type="text" placeholder=" ">
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Tên</span>
                        <i class="fa-solid fa-triangle-exclamation box-input-placeholderInput__iconWarning"></i>
                    </div>
                    <div class="box-input-line"></div>
                </div>

                <div class="box-input">
                    <input value="${phoneNumb && phoneNumb || ''}" class="box-input-inputItem phoneNumb" type="number" placeholder=" ">
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Điện thoại</span>
                        <i class="fa-solid fa-triangle-exclamation box-input-placeholderInput__iconWarning"></i>
                    </div>
                    <div class="box-input-line"></div>
                </div>

                <div class="box-input">
                    <input value="${email && email || ''}" class="box-input-inputItem email" type="text" placeholder=" ">
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Email</span>
                        <i class="fa-solid fa-triangle-exclamation box-input-placeholderInput__iconWarning"></i>
                    </div>
                    <div class="box-input-line"></div>
                </div>
        
                <div class="bookRoomForm-date-picker--background">
                    <input class="bookRoomForm-date-picker" type="datetime-local" placeholder="Hạn nhận phòng">
                </div>
        
                <div class="bookRoomForm-notifi hidden"></div>
        
                <div class="bookRoomForm-btnContainer">
                    <div class="bookRoomForm-btnContainer-btnItem btn--cancel">Hủy</div>
                    <div class="bookRoomForm-btnContainer-btnItem btn--confirm">Xác nhận</div>
                </div>
            `;
        };
        if (type === 'book-room') {
            bookRoomForm.innerHTML = `
                <div class="bookRoomForm-title">${title && title || ''}</div>
                
                <div class="box-input">
                    <input class="box-input-inputItem guestName" type="text" placeholder=" ">
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Tên</span>
                        <i class="fa-solid fa-triangle-exclamation box-input-placeholderInput__iconWarning"></i>
                    </div>
                    <div class="box-input-line"></div>
                </div>
        
                <div class="box-input">
                    <input value="${phoneNumb && phoneNumb || ''}" class="box-input-inputItem phoneNumb" type="number" placeholder=" ">
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Điện thoại</span>
                        <i class="fa-solid fa-triangle-exclamation box-input-placeholderInput__iconWarning"></i>
                    </div>
                    <div class="box-input-line"></div>
                </div>
                
                <div class="box-input">
                    <input value="${email && email || ''}" class="box-input-inputItem email" type="text" placeholder=" ">
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Email</span>
                        <i class="fa-solid fa-triangle-exclamation box-input-placeholderInput__iconWarning"></i>
                    </div>
                    <div class="box-input-line"></div>
                </div>
        
                <div class="bookRoomForm-date-picker--background">
                    <input class="bookRoomForm-date-picker" type="datetime-local" placeholder="Hạn nhận phòng">
                </div>
        
                <div class="bookRoomForm-notifi hidden"></div>
        
                <div class="bookRoomForm-btnContainer">
                    <div class="bookRoomForm-btnContainer-btnItem btn--cancel">Hủy</div>
                    <div class="bookRoomForm-btnContainer-btnItem btn--confirm">Xác nhận</div>
                </div>
            `;
        };
        if (type === 'received-room-offline') {
            bookRoomForm.innerHTML = `
                <div class="bookRoomForm-title">${title && title || ''}</div>

                <div class="box-input">
                    <input class="box-input-inputItem guestName" type="text" placeholder=" ">
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Tên</span>
                        <i class="fa-solid fa-triangle-exclamation box-input-placeholderInput__iconWarning"></i>
                    </div>
                    <div class="box-input-line"></div>
                </div>

                <div class="box-input">
                    <input class="box-input-inputItem phoneNumb" type="number" placeholder=" ">
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Điện thoại</span>
                        <i class="fa-solid fa-triangle-exclamation box-input-placeholderInput__iconWarning"></i>
                    </div>
                    <div class="box-input-line"></div>
                </div>

                <div class="box-input">
                    <input class="box-input-inputItem IDcard" type="number" placeholder=" ">
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Số CCCD</span>
                        <i class="fa-solid fa-triangle-exclamation box-input-placeholderInput__iconWarning"></i>
                    </div>
                    <div class="box-input-line"></div>
                </div>

                <div class="box-input">
                    <input class="box-input-inputItem guestAmount" type="number" placeholder=" ">
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Số người</span>
                        <i class="fa-solid fa-triangle-exclamation box-input-placeholderInput__iconWarning"></i>
                    </div>
                    <div class="box-input-line"></div>
                </div>

                <div class="bookRoomForm-btnContainer">
                    <div class="bookRoomForm-btnContainer-btnItem btn--cancel">Hủy</div>
                    <div class="bookRoomForm-btnContainer-btnItem btn--confirm">Xác nhận</div>
                </div>
            `;
        };
        if (type === 'received-room') {
            bookRoomForm.innerHTML = `
                <div class="bookRoomForm-title">${title && title || ''}</div>
                
                <div class="box-input">
                    <input value="${guestName && guestName || ''}" class="box-input-inputItem guestName" type="text" placeholder=" ">
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Tên</span>
                        <i class="fa-solid fa-triangle-exclamation box-input-placeholderInput__iconWarning"></i>
                    </div>
                    <div class="box-input-line"></div>
                </div>

                <div class="box-input">
                    <input value="${phoneNumb && phoneNumb || ''}" class="box-input-inputItem phoneNumb" type="number" placeholder=" ">
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Điện thoại</span>
                        <i class="fa-solid fa-triangle-exclamation box-input-placeholderInput__iconWarning"></i>
                    </div>
                    <div class="box-input-line"></div>
                </div>

                <div class="box-input">
                    <input class="box-input-inputItem IDcard" type="number" placeholder=" ">
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Số CCCD</span>
                        <i class="fa-solid fa-triangle-exclamation box-input-placeholderInput__iconWarning"></i>
                    </div>
                    <div class="box-input-line"></div>
                </div>

                <div class="box-input">
                    <input value="${email && email || ''}" class="box-input-inputItem email" type="text" placeholder=" ">
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Email</span>
                        <i class="fa-solid fa-triangle-exclamation box-input-placeholderInput__iconWarning"></i>
                    </div>
                    <div class="box-input-line"></div>
                </div>
        
                <div class="box-input">
                    <input class="box-input-inputItem guestAmount" type="number" placeholder=" ">
                    <div class="box-input-placeholderInput">
                        <span class="box-input-placeholderInput-text">Số người</span>
                        <i class="fa-solid fa-triangle-exclamation box-input-placeholderInput__iconWarning"></i>
                    </div>
                    <div class="box-input-line"></div>
                </div>
        
                <div class="bookRoomForm-btnContainer">
                    <div class="bookRoomForm-btnContainer-btnItem btn--cancel">Hủy</div>
                    <div class="bookRoomForm-btnContainer-btnItem btn--confirm">Xác nhận</div>
                </div>
            `;
        };

        overlay();
        body.appendChild(bookRoomForm);
        return bookRoomForm;
    };

    function removeElWhenBlur() {
        const arrEl = [
            { el: '.option li.filter', remove: '.option li.filter .select.active', handle: null },
            { el: '.option li.sort', remove: '.option li.sort .select.active', handle: null },
            { el: '.branch__select', remove: '.branch__select.active', handle: arrowSelect },
            { el: '.convenient__select', remove: '.convenient__select.active', handle: arrowSelect },
        ];
        window.addEventListener('click', async(e) => {
            arrEl.forEach(item => {
                const { el, remove, handle } = item;
                X$(el) && removeElHandle(e.composedPath(), X$(el), remove, handle);
            });
        });
        // func children
        function removeElHandle(path, el, removeEl, moreHandle) {
            const arr = [];
            path.forEach(parentEl => { parentEl === el && arr.push(el) });
            if (arr.length) return;
            if (el.querySelector(removeEl)) {
                el.querySelector(removeEl).classList.remove('active');
                moreHandle && moreHandle(el);
            };
            if (el.classList.contains('active')) {
                el.classList.remove('active');
                moreHandle && moreHandle(el);
            };
        };
        // more handle
        function arrowSelect(el) {
            const arrow = el.querySelector('i.fa-solid');
            arrow.className = 'fa-solid fa-square-chevron-down';
        };
    };

    function getDateString(vari) {
        const date = vari;
        let h = date.getHours();
        let mi = date.getMinutes();
        let d = date.getDate();
        let m = date.getMonth();
        let y = date.getFullYear();
        h < 10 ? h = '0' + h : h = h;
        mi < 10 ? mi = '0' + mi : mi = mi;
        d < 10 ? d = '0' + d : d = d;
        m+1 < 10 ? m = '0' + (m+1) : m = m+1;
        y < 10 ? y = '0' + y : y = y;
        const dateString = d+'/'+m+'/'+y+' '+h+':'+mi;
        return dateString;
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

    function defaultPageFunc(...args) {
        const [isAdmin] = args;
        renderHandle(isAdmin);
    };

    function iconWarningAnimate(form, btn) {
        const inputs = form.querySelectorAll('input:not(.bookRoomForm-date-picker)');
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
    };

    function logOutHandle(url, id) {
        const btnLogOut = X$('header .btn-log-out');
        btnLogOut.onclick = () => {
            const title = 'Đăng xuất ?';
            createNotifiElement(title);
            const titleElement = X$('.notifi-content');
            titleElement.style.fontSize = '25px';
            const btnCancel = X$('.notifi-btnContainer-btnItem.btn--cancel');
            const btnConfirm = X$('.notifi-btnContainer-btnItem.btn--confirm');
            btnCancel.onclick = () =>{
                X$('.notifi').remove();
                overlay('hide');
            };
            btnConfirm.onclick = () => {
                usingFetch('PATCH', url + '/' + id, { online: false })
                    .then(() => { window.close() })
            };
        };
    };

    window.addEventListener('resize', () => {
        activeNavItemsFunc(X$(".navbar .navbar__activeBackground"), X$(".navbar li.active"));

        // func children
        function activeNavItemsFunc(element, activeElement) {
            if (!activeElement) return;
            Object.assign(element.style, {
                width: activeElement.offsetWidth + "px",
                height: activeElement.offsetHeight + "px",
                left: activeElement.offsetLeft + "px"
            });
        };
    });

    function start() {
        getData();
        cancelDropFile();
    };
    start();
};
window.addEventListener("DOMContentLoaded", initApp);