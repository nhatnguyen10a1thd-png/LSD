# 1986 — Bước ngoặt Đổi mới

Chuyên đề scrollytelling tiếng Việt gồm năm chương, ba biểu đồ SVG và so sánh ảnh gốc/phục chế. Website tĩnh sử dụng HTML, CSS, JavaScript thuần; không có bước build, máy chủ ứng dụng, cơ sở dữ liệu hay thư viện tải từ bên ngoài.

## Mở và sửa website

- Mở `dist/index.html` bằng trình duyệt để đọc bản local. Dữ liệu được đóng gói trong `dist/data/series.js`, nên biểu đồ hoạt động cả khi mở file trực tiếp.
- Nội dung: `dist/index.html`. Giao diện: `dist/styles.css`. Tương tác và biểu đồ: `dist/app.js`.
- Hình ảnh: `dist/assets/`. Xuất xứ, giấy phép và prompt phục chế: [MEDIA.md](MEDIA.md).
- Dữ liệu xuất bản: `dist/data/series.json` và `series.js`. Phản hồi API gốc: `source-data/`.

## Xuất bản miễn phí bằng Cloudflare Pages

Tài khoản và phiên đăng nhập Cloudflare thuộc người dùng. Không cần thẻ thanh toán để dùng gói Free và tên miền `pages.dev` cho website tĩnh này.

1. Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Vào **Workers & Pages**, chọn tạo ứng dụng/website Pages, sau đó **Direct Upload / Upload assets**. Giao diện Dashboard có thể thay đổi tên nút; chọn Pages với phương thức tải tài sản tĩnh trực tiếp.
3. Đặt tên dự án, gợi ý `1986-buoc-ngoat-doi-moi`. Cloudflare sẽ kiểm tra tên có khả dụng hay không.
4. Tải lên gói `doi-moi-1986-cloudflare.zip`. `index.html` phải nằm ngay ở gốc ZIP. Có thể kéo toàn bộ nội dung thư mục `dist` thay cho ZIP.
5. Chọn **Deploy site** và lưu URL HTTPS do Cloudflare cung cấp, dạng `https://<tên-dự-án>.pages.dev`.
6. Mở URL bằng cửa sổ riêng tư, kiểm tra ảnh, ba biểu đồ, mục lục và thanh so sánh. Thử trên điện thoại và cuộn cả hai chiều.

Tài liệu chính thức: [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/), [giá phục vụ tài sản tĩnh](https://developers.cloudflare.com/pages/functions/pricing/). Website chỉ phục vụ file tĩnh và không dùng Pages Functions. Với gói Free và tên miền được cấp, chi phí hosting theo cấu hình này là 0 đồng/tháng; kiểm tra chính sách Cloudflare nếu thay đổi kiến trúc hay thêm dịch vụ.

Chưa có URL công khai cho đến khi tài khoản Cloudflare thực sự triển khai dự án. Tên miền ví dụ ở trên không phải URL đã xuất bản.

## Cập nhật dữ liệu và nội dung

Chạy từ thư mục dự án trên Windows PowerShell:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/fetch-public-data.ps1
```

Script tải năm chỉ tiêu World Bank cho Việt Nam, giữ nguyên giá trị và lưu phản hồi gốc. Phiên bản hiện tại lấy giai đoạn 1986–2025; loại năm 2026 chưa hoàn tất. Ảnh gốc đã có sẽ được giữ nguyên. Cập nhật thủ công nội dung, năm kết thúc, các nút mốc và giai đoạn API nếu chuẩn bị bản xuất bản mới trong những năm sau. Không chỉ thay đổi nhãn năm khi chưa có số liệu.

Ba ngành không cộng thành 100% ở mọi năm: giữ nguyên giá trị gia tăng từng ngành theo WDI, không chuẩn hóa. GDP/người là USD cố định 2015; không diễn giải thành thu nhập nhận được của mỗi người. Tỷ lệ đô thị phụ thuộc định nghĩa quốc gia và có thể gồm ước tính.

Sau sửa đổi, tạo lại ZIP bằng:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/package.ps1
```

Trong dự án Pages hiện có, tạo deployment mới và tải gói mới lên. Dự án tạo bằng Direct Upload không chuyển trực tiếp sang Git integration; nếu cần quy trình Git, tạo dự án Pages mới theo tài liệu Cloudflare.

## Kiểm tra

`scripts/verify.cjs` dùng Node.js và Playwright cho kiểm thử phát triển. Đây không phải phụ thuộc của website và không được tải lên hosting.

```powershell
# Sau khi cài Playwright trong môi trường phát triển:
node scripts/verify.cjs
```

Có thể đặt `PLAYWRIGHT_MODULE_PATH` tới module Playwright sẵn có và `PLAYWRIGHT_CHROMIUM_EXECUTABLE` tới Chromium headless. Kiểm thử đối chiếu số liệu với phản hồi API gốc, kiểm tra mốc năm khi cuộn hai chiều, bàn phím, ảnh, bố cục 320/390/768/1440 px và giảm chuyển động. Báo cáo và ảnh chụp nằm trong `qa/`.

## Bàn giao

- `dist/`: thư mục sẵn sàng tải lên hosting.
- `doi-moi-1986-cloudflare.zip`: chỉ nội dung website, không chứa công cụ phát triển.
- `doi-moi-1986-source.zip`: mã nguồn, dữ liệu gốc, tài liệu và kết quả kiểm thử; không chứa trình duyệt kiểm thử, token hay thông tin tài khoản.

Ảnh và dữ liệu thuộc các chủ sở hữu được ghi riêng. Khi tái sử dụng, giữ phần ghi công, giấy phép và nhãn phục chế AI.
