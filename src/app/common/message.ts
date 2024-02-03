export const action = {
    create: 'Thêm mới',
    update: 'Cập nhật',
    delete: 'Xoá',
    login: 'Đăng nhập',
    register: 'Đăng ký',
    logout: 'Đăng xuất',
    upload: 'Tải lên',
    download: 'Tải xuống',
    search: 'Tìm kiếm',
    filter: 'Lọc',
    reset: 'Làm mới',
    save: 'Lưu',
    cancel: 'Hủy',
    close: 'Đóng',
    confirm: 'Xác nhận',
    back: 'Quay lại',
    next: 'Tiếp theo',
    previous: 'Trở lại',
    finish: 'Hoàn thành',
    submit: 'Gửi',
    accept: 'Chấp nhận',
    reject: 'Từ chối',
    approve: 'Phê duyệt',
    view: 'Xem',
    detail: 'Chi tiết',
    edit: 'Chỉnh sửa',
    auth: 'Xác thực',
}

export const title = {
    info: 'Thông tin',
    detail: 'Chi tiết',
    description: 'Mô tả',
    note: 'Ghi chú',
    error: 'Lỗi',
    success: 'Thành công',
    warning: 'Cảnh báo',
    confirm: 'Xác nhận',
    cancel: 'Hủy',
}

export const object = {
    pet: 'thú cưng',
    user: 'người dùng',
    role: 'vai trò',
    permission: 'quyền',
    image: 'hình ảnh',
    file: 'tập tin',
    verifyCode: 'mã xác thực',
}

export const result = {
    success: 'thành công',
    fail: 'thất bại',
    error: 'lỗi',
    notMatch: 'không chính xác',
    exist: 'đã tồn tại',
}

export const message = {
    error: 'Đã xảy ra lỗi. Vui lòng thử lại sau',
    notFound: 'Không tìm thấy',
    noData: 'Không có dữ liệu',
    noPermission: 'Không có quyền',
    noRole: 'Không có vai trò',
    requiredInfo: 'Vui lòng nhập đầy đủ thông tin',
    wait: 'Vui lòng thử lại sau',
    again: 'Vui lòng thử lại',
    cancelDelete: 'Từ chối quá trình xoá dữ liệu',
}

export const messageLogin = {
    notMatch: title.info + ' ' + object.user + ' ' + result.notMatch,
    error: action.login + ' ' + result.fail + '. ' + message.wait,
}

export const messageRegister = {
    exist: title.info + ' ' + object.user + ' ' + result.exist,
    fail: action.register + ' ' + result.fail + '. ' + message.wait, 
}

export const messageVerify = {
    success: action.auth + ' ' + result.success,
    fail: action.auth + ' ' + result.fail + '. ' + message.again,
    notMatch: title.info + ' ' + object.verifyCode + ' ' + result.notMatch,
    error: message.error,
}

export const messagePet = {
    createSuccess: action.create + ' ' + object.pet + ' ' + result.success,
    updateSuccess: action.update + ' ' + object.pet + ' ' + result.success,
    updateImageSuccess: action.update + ' ' + object.image + ' ' + object.pet + ' ' + result.success,
    deleteSuccess: action.delete + ' ' + object.pet + ' ' + result.success,
}
