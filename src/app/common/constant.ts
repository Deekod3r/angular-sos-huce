import { CONFIG } from "./config";

export const ACTION = {
    CREATE: 1,
    UPDATE: 2,
    DELETE: 3,
    VIEW: 4,
}

export const PET = {
    SEARCH: {
        LIMIT_DEFAULT: 5,
        LIMIT_DEFAULT_CLIENT: 24
    },
    MORE_INFO: [
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
    ],
    MORE_INFO_KEY: {
        NO: 1,
        YES: 2,
        UNKNOWN: 3
    },
    STATUS: [
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
    ],
    STATUS_MODIFY: [
        { 
            label: "Đã chết", 
            value: 1 
        },
        { 
            label: "Đang điều trị", 
            value: 3 
        },
        { 
            label: "Chờ nhận nuôi", 
            value: 4 
        },
    ],
    STATUS_KEY: {
        DEAD: 1,
        ADOPTED: 2,
        TREATING: 3,
        WAITING: 4
    },
    TYPE: [
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
    ],
    GENDER: [
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
    ],
    AGE: [
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
    ],
    BREED: [
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
    ],
    COLOR: [
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
    ]
}

export const ADOPT = {
    SEARCH: {
        LIMIT_DEFAULT: 5,
    },
    STATUS: [
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
    ],
    STATUS_KEY: {
        WAITING: 1,
        IN_PROGRESS: 2,
        REJECT: 3,
        CANCEL: 4,
        COMPLETE: 5
    }

}

export const USER = {
    SEARCH: {
        LIMIT_DEFAULT: 5,
    },
    ROLE: [
        {
            label: "Quản trị viên",
            value: CONFIG.ROLE.ADMIN
        },
        {
            label: "Người dùng",
            value: CONFIG.ROLE.USER
        }
    ],
    STATUS: [
        {
            label: "Đang kích hoạt",
            value: true
        },
        {
            label: "Bị khóa",
            value: false
        }
    ],
}

export const NEWS = {
    SEARCH: {
        LIMIT_DEFAULT: 5,
        LIMIT_DEFAULT_CLIENT: 4
    },
    STATUS: [
        {
            label: "Hiển thị",
            value: true
        },
        {
            label: "Ẩn",
            value: false
        }
    ],
    STATUS_KEY: {
        ACTIVE: true,
        DEACTIVE: false
    }
}

export const GALLERIA = {
    SEARCH: {
        LIMIT_DEFAULT: 5,
    },
    STATUS: [
        {
            label: "Đang hiển thị",
            value: true
        },
        {
            label: "Đã ẩn",
            value: false
        }
    ],
    STATUS_KEY: {
        ACTIVE: true,
        DEACTIVE: false
    }
}

export const DONATION = {
    SEARCH: {
        LIMIT_DEFAULT: 5,
        LIMIT_DEFAULT_CLIENT: 10
    },
    TYPE: [
        {
            label: "Tiền",
            value: 1
        },
        {
            label: "Hiện vật",
            value: 2
        },
        {
            label: "Khác",
            value: 3
        },
    ],
    TYPE_KEY: {
        MONEY: 1,
        GOODS: 2,
        OTHER: 3
    }
}

export const LIVING_COST = {
    SEARCH: {
        LIMIT_DEFAULT: 5,
        LIMIT_DEFAULT_CLIENT: 10
    },
    STATUS: [
        {
            label: "Hiển thị",
            value: true
        },
        {
            label: "Ẩn",
            value: false
        }
    ],
    STATUS_KEY: {
        ACTIVE: true,
        DEACTIVE: false
    },
    CATEGORY: [
        {
            label: "Thức ăn",
            value: 1
        },
        {
            label: "Thuốc",
            value: 2
        },
        {
            label: "Vật dụng",
            value: 3
        },
        {
            label: "Khác",
            value: 4
        },
    ],
    CATEGORY_KEY: {
        FOOD: 1,
        MEDICINE: 2,
        EQUIPMENT: 3,
        OTHER: 4
    }
}

export const TREATMENT = {
    SEARCH: {
        LIMIT_DEFAULT: 5,
        LIMIT_DEFAULT_CLIENT: 10
    },
    STATUS: [
        {
            label: "Hiển thị",
            value: true
        },
        {
            label: "Ẩn",
            value: false
        }
    ],
    STATUS_KEY: {
        ACTIVE: true,
        DEACTIVE: false
    },
    TYPE: [
        {
            label: "Tiêm phòng tổng hợp",
            value: 1
        },
        {
            label: "Tiêm dại",
            value: 2
        },
        {
            label: "Triệt sản",
            value: 3
        },
        {
            label: "Chữa bệnh",
            value: 4
        },
        {
            label: "Khác",
            value: 5
        },
    ],
    TYPE_KEY: {
        VACCINE: 1,
        RABIES: 2,
        STERILIZATION: 3,
        TREATMENT: 4,
        OTHER: 5
    }
}

export const SYSTEM = {
    ORG_INFO_CONTACT: 'ORG_INFO_CONTACT',
    ORG_INFO_SOCIAL: 'ORG_INFO_SOCIAL',
    ORD_INTRODUCTION: 'ORD_INTRODUCTION',
    DONATE: 'DONATE',
    ADOPT_PROCESS: 'ADOPT_PROCESS',
    ADOPT_CONDITON: 'ADOPT_CONDITON',
    VOLUNTEER_CONDITION: 'VOLUNTEER_CONDITION',
    VOLUNTEER_INTRODUCTION: 'VOLUNTEER_INTRODUCTION'
}


export const REGEX = {
    DIGIT: /^\d+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,100}$/,
    CHARACTER: /^[a-zA-ZưứừữựửƯỨỪỮỰỬéèẽẹẻÉÈẼẸẺếềễệểẾỀỄỆỂýỳỹỵỷÝỲỸỴỶúùũụủÚÙŨỤỦíìĩịỉÍÌĨỊỈóòõọỏÓÒÕỌỎốồỗộổỐỒỖỘỔớờỡợởỚỜỠỢỞáàãạảÁÀÃẠẢấầẫậẩẤẦẪẬẨắằẵặẳẮẰẴẶẲđĐ ]{1,}$/,
}

export const MIN_DATE = new Date(2020, 0, 1);

export const MAX_DATE = new Date();

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