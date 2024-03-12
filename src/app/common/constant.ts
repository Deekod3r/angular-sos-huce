export const typeAction = {
    create: 0,
    update: 1,
    delete: 2,
    view: 3
}

export const moreInfor = {
    no: 1,
    yes: 2,
    undefined: 3
}

export const petSearch = {
    limitDefault: 5,
    limitDefaultClient: 24
}

export const petStatusKey = {
    dead: 1,
    adopted: 2,
    treating: 3,
    waiting: 4
}

export const adoptStatusKey = {
    waiting: 1,
    inProgress: 2,
    reject: 3,
    cancel: 4,
    complete: 5
}

export const petStatus = [
    { 
        label: "Đã chết", 
        value: 1 
    },
    { 
        label: "Đã được nhận", 
        value: 2 
    },
    { 
        label: "Đang điều trị", 
        value: 3 
    },
    { 
        label: "Chờ nhận nuôi", 
        value: 4 
    },
];

export const petType = [
    {
        label: "Chó",
        value: 1
    },
    {
        label: "Mèo",
        value: 2
    },
    {
        label: "Khác",
        value: 3
    }
]

export const petGender = [
    {
        label: "Đực",
        value: 1
    },
    {
        label: "Cái",
        value: 2
    },
    {
        label: "Chưa rõ",
        value: 3
    }
]

export const petAge = [
    {
        label: "Trẻ",
        value: 1
    },
    {
        label: "Trưởng thành",
        value: 2
    },
    {
        label: "Già",
        value: 3
    },
    {
        label: "Chưa rõ",
        value: 4
    }
]

export const petBreed = [
    {
        label: "Retriever Vàng",
    },
    {
        label: "Bull",
    },
    {
        label: "Poodle",
    },
    {
        label: "Chó ta",
    },
    {
        label: "Chó tây",
    },
    {
        label: "Husky",
    },
    {
        label: "Ba Tư",
    },
    {
        label: "Maine Coon",
    },
    {
        label: "Ragdoll",
    },
    {
        label: "Bengal",
    },
    {
        label: "Sphynx",
    },
    {
        label: "Anh lông ngắn",
    },
    {
        label: "Anh lông dài",
    },
    {
        label: "Mèo ta",
    },
    {
        label: "Mèo tây",
    },
    {
        label: "Mèo lai",
    }
];

export const petColor = [
    {
        label: "Trắng",
    },
    {
        label: "Vàng",
    },
    {
        label: "Đen trắng",
    },
    {
        label: "Trắng vàng",
    },
    {
        label: "Đen",
    },
    {
        label: "Mướp",
    },
    {
        label: "Tam thể",
    },
    {
        label: "Nhị thể",
    },
    {
        label: "Đồi nồi",
    },
    {
        label: "Xám",
    },
    {
        label: "Xiêm",
    },
    {
        label: "Nâu",
    },
    {
        label: "Nâu vàng",
    },
    {
        label: "Đen vàng",
    },
    {
        label: "Trắng xám",
    },
    {
        label: "Trắng nâu",
    }
];


export const petMoreInfor = [
    {
        label: "Không",
        value: 1
    },
    {
        label: "Có",
        value: 2
    },
    {
        label: "Chưa rõ",
        value: 3
    }
]

export const adoptStatus = [
    {
        label: "Chờ xử lý",
        value: 1
    },
    {
        label: "Đang xử lý",
        value: 2
    },
    {
        label: "Từ chối",
        value: 3
    },
    {
        label: "Đã hủy",
        value: 4
    },
    {
        label: "Hoàn thành",
        value: 5
    }
]

export const adoptSearch = {
    limitDefault: 5,
}

export const CALENDER_CONFIG = {
    firstDayOfWeek: 1,
    dayNames: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 6', 'Chủ nhật'],
    dayNamesShort: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    dayNamesMin: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10',
        'Tháng 11', 'Tháng 12'],
    monthNamesShort: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
    today: 'Hôm nay',
    clear: 'Xóa',
};

export const MIN_DATE = new Date(2020, 0, 1);

export const MAX_DATE = new Date();