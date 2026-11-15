# CYBER MONEY ALERT VIP — V1

Web App/PWA tĩnh dành cho Safari trên iPhone/iPad, giao diện đen-đỏ Cyber.

## Có trong bản này
- Responsive cho iPhone/iPad.
- PWA manifest, service worker và icon.
- Lưu lịch sử giao dịch DEMO trên thiết bị bằng localStorage.
- Nút tạo giao dịch thử, chống trùng ID trong ứng dụng.
- Đọc câu thử bằng SpeechSynthesis tiếng Việt (`vi-VN`) nếu iOS/Safari có giọng phù hợp.
- Bật/tắt đọc tự động, chỉnh tốc độ, xóa lịch sử.
- Có thông báo web tùy quyền trình duyệt.

## Giới hạn quan trọng
Bản này **không kết nối Techcombank** và không thể đọc thông báo riêng của Techcombank Mobile. iOS/Safari không cấp quyền cho website đọc push notification của ứng dụng khác. Shadowrocket chỉ quản lý proxy, không mở quyền truy cập thông báo ngân hàng.

Muốn nhận giao dịch thật cần API ngân hàng/đối tác được ủy quyền hoặc một nguồn dữ liệu giao dịch hợp pháp. Không nhập mật khẩu, OTP, mã PIN hay thông tin đăng nhập ngân hàng vào web app này.

PWA trên iPhone có thể được thêm vào Màn hình chính, nhưng khả năng đọc giọng nói khi app ở nền/đang khóa màn hình không được đảm bảo. SpeechSynthesis phụ thuộc phiên bản iOS, giọng hệ thống và trạng thái Safari.

## Xuất bản miễn phí bằng GitHub Pages
1. Đăng nhập GitHub và tạo repository mới, ví dụ `cyber-money-alert`.
2. Chọn Public (hoặc kiểm tra điều kiện Pages theo gói GitHub của bạn).
3. Upload toàn bộ file và thư mục trong gói này lên thư mục gốc repository.
4. Mở **Settings → Pages**.
5. Trong **Build and deployment**, chọn **Deploy from a branch**.
6. Chọn branch `main`, folder `/ (root)`, nhấn Save.
7. Chờ GitHub Pages triển khai. Đường dẫn thường có dạng `https://TEN-GITHUB.github.io/cyber-money-alert/`.
8. Mở link bằng Safari trên iPhone/iPad.
9. Nhấn nút Chia sẻ → **Thêm vào Màn hình chính** → bật **Mở dưới dạng ứng dụng web** nếu tùy chọn xuất hiện.

## Cập nhật
Upload/commit file mới vào repository. Service worker sẽ lấy phiên bản mới sau khi trình duyệt cập nhật cache; nếu chưa thấy thay đổi, đóng hẳn web app rồi mở lại hoặc xóa dữ liệu website trong Safari.

## Chạy thử
Nhấn **Thử tiền vào** để tạo giao dịch mẫu. Nhấn **Thử giọng đọc** để kiểm tra giọng tiếng Việt. Đây là dữ liệu minh họa, không phải giao dịch thật.
