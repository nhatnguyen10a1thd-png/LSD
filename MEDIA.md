# Xuất xứ và xử lý hình ảnh

## Tem phiếu thời bao cấp

- File: `dist/assets/ration-coupons.jpg`, 1151 × 864 px.
- Tác giả: Myra Siason. Ngày chụp ảnh hiện vật: 08/08/2007; không phải ảnh chụp năm 1986.
- Nguồn: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tem_phi%E1%BA%BFu_th%E1%BB%9Di_bao_c%E1%BA%A5p.jpg).
- Giấy phép: [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/).
- Thao tác: giữ nguyên file gốc; không phục chế. Khung ảnh, nghiêng nhẹ và kích thước hiển thị được thực hiện bằng CSS. Ảnh toàn khung hiển thị trong chương 1.

## Cảng TP.HCM khoảng năm 1999

- File gốc: `dist/assets/port-1999-original.jpg`, 2340 × 1599 px.
- Tác giả: Rc1959. Thời điểm: khoảng năm 1999 theo mô tả nguồn.
- Nguồn: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Vietnam_-_Port_d%27Ho-Chi-Minh-ville_vers_1999.jpg).
- Giấy phép: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Thao tác đối với bản gốc: giữ nguyên file. Phần bìa có crop hiển thị và lớp tối bằng CSS; chú thích bìa ghi rõ mốc khoảng 1999. Bộ so sánh trong chương 4 hiển thị toàn khung.

## Bản phục chế AI

- File cuối: `dist/assets/port-1999-restored.png`, 1517 × 1037 px.
- Chế độ công cụ: OpenAI imagegen, edit, một ảnh tham chiếu là file cảng gốc; nền không trong suốt; một lần gọi công cụ. Thực hiện ngày 07/10/2026.
- Dẫn xuất từ ảnh Rc1959, CC BY 4.0. Giữ ghi công và giấy phép của ảnh gốc; đánh dấu phần chỉnh sửa do AI.
- Mục đích: làm sạch hạt quét và điều chỉnh nhẹ độ rõ, giữ màu gần đơn sắc. Kết quả có thể diễn giải lại chi tiết mờ như chữ, cây và mặt nước. Không dùng bản AI để xác nhận chi tiết lịch sử; bản gốc luôn được cung cấp để đối chiếu.
- Kết quả xuất có độ phân giải và tỷ lệ khung xấp xỉ bản gốc; giao diện căn hai ảnh vào cùng khung gốc để so sánh. Đây không phải phục chế pháp chứng hay bản quét có độ chính xác từng điểm ảnh.

Prompt nguyên văn:

```text
Use case: precise-object-edit
Asset type: historical photograph restoration for the Vietnamese factual scrollytelling site “1986 — Bước ngoặt Đổi mới”.
Input image 1: edit target, the existing historical photograph of Ho Chi Minh City port circa 1999 by Rc1959. This image is the sole source of visual truth.
Primary request: perform only very restrained cleanup of scan dust and coarse scan grain, with a very slight correction to exposure and clarity. Preserve the photograph’s original near-monochrome color and faint tint exactly; preserve natural photographic grain and age. Keep the result recognizably the same archival photograph.
Composition/framing: preserve the original full frame and original 2340:1599 aspect ratio, perspective, positions and proportions. Do not crop, extend, straighten, zoom or recompose.
Constraints: preserve every original historical detail, all visible vessels if any, buildings, windows, trees, people, railings, ropes, cables, poles, waterfront structures, water patterns and lettering. Keep the SHIPFLACOM sign and all other letters as they appear in the source, including imperfect legibility. Do not reconstruct unreadable detail or sharpen it into invented forms. Change only small scan defects and subtle tonal clarity.
Avoid: invented additions, removal of scene objects, reconstruction of architecture or people, rewritten text, colorization, saturation shifts, modern elements, cinematic restyling, dramatic contrast, artificial HDR, smooth plastic surfaces, aggressive sharpening, new watermarks.
```

## Dữ liệu

Năm chỉ tiêu WDI của World Bank, giấy phép theo [World Bank Public Licenses](https://datacatalog.worldbank.org/public-licenses). Mã nguồn biểu đồ đọc dữ liệu đi kèm trong `dist/data/`; không gửi dữ liệu người đọc tới API. Mỗi biểu đồ ghi mã chỉ tiêu, đơn vị, năm cuối và ngày lấy dữ liệu. Thông tin phiên bản gốc được giữ trong `source-data/`.

## Phông chữ

Lora, bản thường và nghiêng, tải từ [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/lora). Hai file TTF được giữ nguyên và đóng gói cùng website để hỗ trợ tiếng Việt, không gọi Google Fonts khi đọc. Giấy phép SIL Open Font License 1.1 nằm trong `dist/assets/OFL-Lora.txt`.
