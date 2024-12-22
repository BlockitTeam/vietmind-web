export const displayStatusAppointment = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Đang đợi xác nhận";

    case "CONFIRMED":
      return "Đã xác nhận";

    case "CANCELLED":
      return "Đã huỷ";

    case "IN_PROGRESS":
      return "Đang diễn ra";

    case "FINISH":
      return "Hoàn thành"
    default:
      break;
  }
};


export const displayAvatar = (fullName: string) => {
  if (fullName) {
    const splitName = fullName.split(/(\s).+\s/).join("").split(' ');
    let avatar = '';
    splitName.map((item) => {
      return avatar += item.charAt(0);
    })

    return avatar.split('').reverse().join('');
  }

  return 'NN';
}