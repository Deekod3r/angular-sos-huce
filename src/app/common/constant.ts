export const responseCode = {
    success: "00",
    failed: "01",
    objectExists: "02",
}

export const responseMessage = {

}

export const typeAction = {
    create: 0,
    update: 1,
    delete: 2,
    view: 3
}

export const moreInfor = {
    no: 0,
    yes: 1,
    undefined: 2
}

export const petSearch = {
    limitDefault: 5,
    limitDefaultClient: 24
}

export const petStatusKey = {
    dead: 0,
    received: 1,
    treating: 2,
    waiting: 3
}

export const petStatus = [
    { 
        label: "Đã chết", 
        value: 0 
    },
    { 
        label: "Đã được nhận", 
        value: 1 
    },
    { 
        label: "Đang điều trị", 
        value: 2 
    },
    { 
        label: "Chờ nhận nuôi", 
        value: 3 
    },
];

export const petType = [
    {
        label: "Chó",
        value: 0
    },
    {
        label: "Mèo",
        value: 1
    },
    {
        label: "Khác",
        value: 2
    }
]

export const petGender = [
    {
        label: "Đực",
        value: 0
    },
    {
        label: "Cái",
        value: 1
    },
    {
        label: "Chưa rõ",
        value: 2
    }
]

export const petAge = [
    {
        label: "Trẻ",
        value: 0
    },
    {
        label: "Trưởng thành",
        value: 1
    },
    {
        label: "Già",
        value: 2
    },
    {
        label: "Chưa rõ",
        value: 3
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
        value: 0
    },
    {
        label: "Có",
        value: 1
    },
    {
        label: "Chưa rõ",
        value: 2
    }
]