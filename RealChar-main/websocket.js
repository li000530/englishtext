// 创建 WebSocket 对象，指定后端服务的 WebSocket 地址
const socket = new WebSocket('ws://127.0.0.1:8000/ws/jjjj');

// 当连接建立时触发的事件处理程序
socket.onopen = function(event) {
  console.log('WebSocket 连接已建立');
  sendMessage('hello');
};

// 当接收到后端服务发送的消息时触发的事件处理程序
socket.onmessage = function(event) {
  console.log('接收到消息:', event.data);
  sendMessage('1');
};

// 当发生错误时触发的事件处理程序
socket.onerror = function(error) {
  console.error('WebSocket 错误:', error);
};

// 当连接关闭时触发的事件处理程序
socket.onclose = function(event) {
  console.log('WebSocket 连接已关闭');
};

// 向后端服务发送消息
function sendMessage(message) {
  socket.send(message);
}
