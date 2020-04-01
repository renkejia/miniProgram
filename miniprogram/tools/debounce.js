// 防抖
function debounce(fun, delay = 600) {
  let timer = null;
  return function () {
      if (timer) {
          clearTimeout(timer);
      }
      timer = setTimeout(() => {
          fun.apply(this, arguments);
      }, delay);
  }
}
