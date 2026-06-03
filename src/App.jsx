
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  Boxes,
  ShoppingCart,
  Wallet,
  ReceiptText,
  Banknote,
  FileText,
  Bot,
  Eye,
  Pencil,
  Trash2,
  Search,
  Plus,
  MessageCircle,
  Barcode,
  MapPinned,
  CalendarDays,
  Sprout,
  Send,
  Printer,
  QrCode,
  ArrowDownUp,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Settings,
  Menu,
  X,
} from "lucide-react";

const resizeImageFile = (file, maxWidth = 220, maxHeight = 120) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/png"));
        } else {
          reject(new Error("Canvas not supported"));
        }
      };
      img.onerror = () => reject(new Error("Image load failed"));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
};

const menuGroups = [
  {
    title: "GENEL",
    items: [
      ["dashboard", "Gösterge Paneli", LayoutDashboard],
      ["customers", "Müşteriler", Users],
      ["dealers", "Bayiler", Store],
      ["products", "Ürünler", Package],
      ["inventory", "Envanter", Boxes],
      ["orders", "Siparişler", ShoppingCart],
    ],
  },
  {
    title: "FİNANS",
    items: [
      ["accounts", "Cari Hesap", Wallet],
      ["collections", "Tahsilatlar", ReceiptText],
      ["cashbank", "Kasa & Banka", Banknote],
      ["offers", "Teklifler", FileText],
      ["companySettings", "Firma Ayarları", Settings],
    ],
  },
  {
    title: "TARIMSAL",
    items: [
      ["farmerCards", "Çiftçi Kartı", Users],
      ["fieldTracking", "Tarla Takibi", MapPinned],
      ["calendar", "Periyodik Takvim", CalendarDays],
      ["barcode", "Barkod Yönetimi", Barcode],
    ],
  },
  {
    title: "ZEKA",
    items: [["ai", "Yapay Zeka Asistanı", Bot]],
  },
];

const initialData = {
  customers: [
    { id: 1, firma: "Ahmet Yılmaz Tarım", sehir: "Adana", telefon: "0532 451 2234", ciro: "₺124.500", durum: "Aktif" },
    { id: 2, firma: "Ege Tarım A.Ş.", sehir: "İzmir", telefon: "0232 445 6789", ciro: "₺512.000", durum: "Aktif" },
    { id: 3, firma: "Marmara Seracılık Ltd.", sehir: "Bursa", telefon: "0226 445 7788", ciro: "₺67.800", durum: "Takipte" },
  ],
  dealers: [
    { id: 1, bayi: "Çukurova Zirai Bayi", bolge: "Akdeniz", yetkili: "Serkan Usta", satis: "₺210.000", durum: "Aktif" },
    { id: 2, bayi: "Ege Zirai Tedarik", bolge: "Ege", yetkili: "Canan Aksoy", satis: "₺145.000", durum: "Aktif" },
    { id: 3, bayi: "Trakya Tarım Noktası", bolge: "Marmara", yetkili: "Hakan Yıldız", satis: "₺92.000", durum: "Pasif" },
  ],
  products: [
    { id: 1, urun: "DAP Gübre", kategori: "Gübre", lot: "LOT-245", parti: "PRT-12", skt: "2027", stok: "520 Adet", durum: "Aktif" },
    { id: 2, urun: "Fungisit X200", kategori: "İlaç", lot: "LOT-881", parti: "PRT-44", skt: "2026", stok: "74 Adet", durum: "Kritik" },
    { id: 3, urun: "Potasyum Nitrat", kategori: "Besin", lot: "LOT-109", parti: "PRT-09", skt: "2028", stok: "112 Adet", durum: "Aktif" },
  ],
  inventory: [
    { id: 1, depo: "Merkez Depo", urun: "DAP Gübre", giris: "800", cikis: "280", kalan: "520", durum: "Normal" },
    { id: 2, depo: "Adana Depo", urun: "Fungisit X200", giris: "120", cikis: "46", kalan: "74", durum: "Kritik" },
    { id: 3, depo: "Mersin Depo", urun: "Potasyum Nitrat", giris: "250", cikis: "138", kalan: "112", durum: "Normal" },
  ],
  orders: [
    { id: 1, no: "SIP-0007", musteri: "Ege Tarım A.Ş.", tutar: "₺91.000", tarih: "02.06.2026", durum: "Onaylandı" },
    { id: 2, no: "SIP-0012", musteri: "Ahmet Yılmaz Tarım", tutar: "₺48.500", tarih: "04.06.2026", durum: "Hazırlanıyor" },
    { id: 3, no: "SIP-0018", musteri: "Marmara Seracılık", tutar: "₺22.300", tarih: "05.06.2026", durum: "Bekliyor" },
  ],
  accounts: [
    { id: 1, musteri: "Ahmet Yılmaz Tarım", borc: "₺24.500", alacak: "₺0", bakiye: "₺24.500", durum: "Borçlu" },
    { id: 2, musteri: "Ege Tarım A.Ş.", borc: "₺0", alacak: "₺18.000", bakiye: "₺18.000", durum: "Alacaklı" },
    { id: 3, musteri: "Marmara Seracılık", borc: "₺11.200", alacak: "₺0", bakiye: "₺11.200", durum: "Takipte" },
  ],
  collections: [
    { id: 1, tahsilatNo: "TAH-0012", musteri: "Marmara Seracılık", tutar: "₺22.300", yontem: "Havale", tarih: "05.06.2026", durum: "Alındı" },
    { id: 2, tahsilatNo: "TAH-0013", musteri: "Ahmet Yılmaz Tarım", tutar: "₺15.000", yontem: "Nakit", tarih: "06.06.2026", durum: "Bekliyor" },
  ],
  cashbank: [
    { id: 1, hesap: "Nakit Kasa", tip: "Kasa", bakiye: "₺84.500", hareket: "Günlük", durum: "Aktif" },
    { id: 2, hesap: "Ziraat Bankası", tip: "Banka", bakiye: "₺412.000", hareket: "Aylık", durum: "Aktif" },
    { id: 3, hesap: "Giderler", tip: "Gider", bakiye: "₺31.000", hareket: "Aylık", durum: "Kontrol" },
  ],
  offers: [
    { id: 1, teklifNo: "TEK-2026-001", musteri: "Ege Tarım A.Ş.", sehir: "İzmir", tarih: "28.05.2026", gecerlilik: "28.06.2026", tutar: "₺145.000", durum: "Gönderildi" },
    { id: 2, teklifNo: "TEK-2026-002", musteri: "Karadeniz Tarım Kooperatifi", sehir: "Trabzon", tarih: "01.06.2026", gecerlilik: "01.07.2026", tutar: "₺88.500", durum: "Kabul Edildi" },
    { id: 3, teklifNo: "TEK-2026-003", musteri: "Güneydoğu Tarım Grubu", sehir: "Şanlıurfa", tarih: "20.05.2026", gecerlilik: "20.06.2026", tutar: "₺210.000", durum: "Siparişe Dönüştü" },
    { id: 4, teklifNo: "TEK-2026-004", musteri: "Trakya Buğday Üreticileri Bir.", sehir: "Edirne", tarih: "02.06.2026", gecerlilik: "02.07.2026", tutar: "₺67.000", durum: "Taslak" },
  ],
  farmerCards: [
    { id: 1, ciftci: "Ahmet Yılmaz", telefon: "0532 451 2234", tarla: "Biber Tarlası", toplamTarla: "3", dekar: "120", bakiye: "₺24.500 Borç", sonUrun: "DAP Gübre", sonraki: "15 gün sonra kontrol" },
    { id: 2, ciftci: "Mehmet Demir", telefon: "0541 778 0099", tarla: "Buğday Tarlası", toplamTarla: "2", dekar: "80", bakiye: "₺8.300 Alacak", sonUrun: "Sıvı Gübre", sonraki: "10 gün sonra uygulama" },
    { id: 3, ciftci: "Zeynep Arslan", telefon: "0530 221 1122", tarla: "Domates Serası", toplamTarla: "1", dekar: "12", bakiye: "₺0", sonUrun: "Fungisit X200", sonraki: "7 gün sonra kontrol" },
  ],
  fieldTracking: [
    { id: 1, ciftci: "Ahmet Yılmaz", tarla: "Biber Tarlası", urun: "DAP Gübre", doz: "25 kg/da", uygulama: "12.05.2026", sonraki: "27.05.2026", durum: "Uygulandı" },
    { id: 2, ciftci: "Mehmet Demir", tarla: "Buğday Tarlası", urun: "Sıvı Gübre", doz: "2 lt/da", uygulama: "14.05.2026", sonraki: "24.05.2026", durum: "Planlandı" },
    { id: 3, ciftci: "Zeynep Arslan", tarla: "Domates Serası", urun: "Fungisit X200", doz: "150 gr/100 L", uygulama: "16.05.2026", sonraki: "23.05.2026", durum: "Gecikti" },
  ],
  calendar: [
    { id: 1, zaman: "Bugün", ciftci: "Ahmet Yılmaz", islem: "İlaçlama kontrolü", tarla: "Biber Tarlası", durum: "Bekliyor" },
    { id: 2, zaman: "Bu Hafta", ciftci: "Mehmet Demir", islem: "2. gübreleme", tarla: "Buğday Tarlası", durum: "Planlandı" },
    { id: 3, zaman: "Geciken", ciftci: "Zeynep Arslan", islem: "Mantar kontrolü", tarla: "Domates Serası", durum: "Acil" },
  ],
  barcode: [
    { id: 1, barkod: "8690001234567", urun: "DAP Gübre", lot: "LOT-245", stok: "250 Adet", islem: "Yazdır", durum: "Aktif" },
    { id: 2, barkod: "8690007654321", urun: "Fungisit X200", lot: "LOT-881", stok: "74 Adet", islem: "QR Oluştur", durum: "Kritik" },
    { id: 3, barkod: "8690005553322", urun: "Potasyum Nitrat", lot: "LOT-109", stok: "112 Adet", islem: "Stok Giriş", durum: "Aktif" },
  ],
};

const pageInfo = {
  customers: ["Müşteriler", "Müşteri kayıtlarını ve iletişim bilgilerini yönetin."],
  dealers: ["Bayiler", "Bölge bayi performanslarını takip edin."],
  products: ["Ürünler", "Gübre, ilaç, tohum ve besin ürünlerini yönetin."],
  inventory: ["Envanter", "Depo giriş çıkış ve kritik stokları takip edin."],
  orders: ["Siparişler", "Sipariş durumlarını ve satış sürecini yönetin."],
  accounts: ["Cari Hesap", "Müşteri alacak, borç ve bakiye takibi."],
  collections: ["Tahsilatlar", "Ödeme ve tahsilat hareketlerini takip edin."],
  cashbank: ["Kasa & Banka", "Kasa, banka, gelir ve gider özetleri."],
  offers: ["Teklifler", "Müşteri tekliflerini oluşturun ve takip edin."],
  companySettings: ["Firma Ayarları", "Teklif PDF'leri için şirket bilgilerini güncelleyin."],
  farmerCards: ["Çiftçi Kartı", "Çiftçinin tüm geçmişini tek ekranda görüntüleyin."],
  fieldTracking: ["Tarla Takibi", "Hangi tarlaya hangi ürün verildiğini takip edin."],
  calendar: ["Periyodik Takvim", "Yaklaşan ve geciken tarımsal işlemleri yönetin."],
  barcode: ["Barkod Yönetimi", "Barkod, QR kod, stok giriş ve çıkış işlemleri."],
};

function App() {
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState(() => {
    if (typeof window === "undefined") return initialData;
    try {
      const stored = window.localStorage.getItem("agropilot_data");
      if (!stored) return initialData;
      const parsed = JSON.parse(stored);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : initialData;
    } catch {
      return initialData;
    }
  });
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [chat, setChat] = useState([
    { from: "ai", text: "Merhaba, stok, müşteri, satış ve tarla işlemleri hakkında soru sorabilirsin." },
    { from: "ai", text: "Öneri: DAP Gübre kritik seviyeye yaklaşıyor. Yeni sipariş açılmalı." },
  ]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("agropilot_data", JSON.stringify(data));
  }, [data]);

  const [salesData, setSalesData] = useState([
    { month: "Oca", value: 38500 },
    { month: "Şub", value: 52000 },
    { month: "Mar", value: 45000 },
    { month: "Nis", value: 70000 },
    { month: "May", value: 62000 },
    { month: "Haz", value: 88000 },
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, type: "Kritik Stok", text: "Fungisit X200 stoğu kritik.", related: { module: "inventory", id: 2 } },
    { id: 2, type: "Geciken Tarla İşlemi", text: "Zeynep Arslan tarla kontrolü gecikti.", related: { module: "fieldTracking", id: 3 } },
    { id: 3, type: "Cari Takip", text: "Marmara Seracılık ödeme gecikmesi.", related: { module: "accounts", id: 3 } },
  ]);

  const [tableFilter, setTableFilter] = useState("Tümü");
  const [calendarTab, setCalendarTab] = useState("Bugün");
  const [tooltip, setTooltip] = useState(null);
  const [company, setCompany] = useState(() => {
    if (typeof window === "undefined") return {
      name: "AGROPILOT ERP",
      logo: "",
      phone: "",
      email: "",
      address: "",
      taxOffice: "",
      taxNumber: "",
    };
    try {
      const stored = window.localStorage.getItem("agropilot_company_settings");
      if (!stored) return {
        name: "AGROPILOT ERP",
        logo: "",
        phone: "",
        email: "",
        address: "",
        taxOffice: "",
        taxNumber: "",
      };
      const parsed = JSON.parse(stored);
      return {
        name: parsed.name || "AGROPILOT ERP",
        logo: parsed.logo || "",
        phone: parsed.phone || "",
        email: parsed.email || "",
        address: parsed.address || "",
        taxOffice: parsed.taxOffice || "",
        taxNumber: parsed.taxNumber || "",
      };
    } catch {
      return {
        name: "AGROPILOT ERP",
        logo: "",
        phone: "",
        email: "",
        address: "",
        taxOffice: "",
        taxNumber: "",
      };
    }
  });

  const saveCompanySettings = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("agropilot_company_settings", JSON.stringify(company));
    alert("Firma ayarları kaydedildi");
  };

  const sendWhatsApp = (record = {}) => {
    const name = record.musteri || record.firma || record.ciftci || record.bayi || "müşterimiz";
    const msg = `Merhaba ${name}, AGROPILOT ERP üzerinden işlem bilgilendirmeniz hazırlanmıştır.`;
    window.open(`https://wa.me/905451712019?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const schemaFor = (module) => {
    // Prefer custom schemas for specific modules
    const custom = {
      farmerCards: ["ciftci", "telefon", "tarla", "dekar", "bakiye", "sonUrun", "sonraki"],
      barcode: ["barkod", "urun", "lot", "stok", "islem"],
      accounts: ["musteri", "borc", "alacak", "bakiye", "durum"],
      fieldTracking: ["ciftci", "tarla", "urun", "doz", "uygulama", "sonraki", "durum"],
      calendar: ["zaman", "ciftci", "islem", "tarla", "durum"],
    };
    if (custom[module]) return custom[module];
    const sample = data[module]?.[0] || {};
    return Object.keys(sample).filter((k) => k !== "id");
  };

  const openModal = (type, module, record = null) => {
    const fields = schemaFor(module);
    const values = record
      ? { ...record }
      : Object.fromEntries(fields.map((f) => [f, ""]));
    setModal({ type, module, record, values });
  };

  const openOfferPdf = (offer) => {
    const printWindow = window.open("", "_blank", "width=860,height=760");
    if (!printWindow) return;

    const escapeHtml = (value) => String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    const logoHtml = company.logo ? `<img class="companyLogo" src="${escapeHtml(company.logo)}" alt="Logo" />` : "";
    const companyName = escapeHtml(company.name || "AGROPILOT ERP");

    const html = `<!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8" />
        <title>Teklif Önizleme - ${escapeHtml(offer.teklifNo)}</title>
        <style>
          body { margin:0; font-family: Arial, sans-serif; background: #07130f; color: #e5e7eb; }
          .page { max-width: 820px; margin: 0 auto; padding: 36px; }
          .card { background: #0b1710; border: 1px solid #17361f; border-radius: 18px; padding: 24px; }
          .headerTop { display:flex; justify-content:space-between; flex-wrap:wrap; align-items:center; gap:16px; margin-bottom:24px; }
          .brandInfo { display:flex; align-items:center; gap:14px; }
          .companyLogo { width: 140px; max-height: 100px; object-fit: contain; border-radius: 12px; background: #07130f; }
          .companyName { font-size: 22px; font-weight: 800; color: #7ee787; }
          .companyContact { text-align:right; min-width: 220px; }
          .companyContact div { color: #9ca98f; font-size: 13px; line-height:1.6; }
          .row { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
          .row label { color: #8fa791; font-size: 12px; text-transform: uppercase; letter-spacing: .4px; display: block; margin-bottom: 6px; }
          .row span { color: #f8fff3; font-size: 16px; font-weight: 700; }
          .footer { margin-top: 28px; font-size: 13px; color: #9ca98f; }
          .printBar { display: flex; justify-content: flex-end; margin-bottom: 20px; }
          .printBtn { background: #22c55e; color: #04120a; border: none; border-radius: 12px; padding: 12px 18px; font-size: 14px; cursor: pointer; }
          @media print { .printBar { display: none; } body { background: #fff; color: #000; } .card { border-color: #d1d5db; background: #fff; } .companyName { color: #000; } }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="printBar">
            <button class="printBtn" onclick="window.print();">Yazdır / PDF İndir</button>
          </div>
          <div class="card">
            <div class="headerTop">
              <div class="brandInfo">${logoHtml}<div class="companyName">${companyName}</div></div>
              <div class="companyContact">
                ${company.address ? `<div>${escapeHtml(company.address)}</div>` : ""}
                ${company.phone ? `<div>Tel: ${escapeHtml(company.phone)}</div>` : ""}
                ${company.email ? `<div>${escapeHtml(company.email)}</div>` : ""}
                ${company.taxOffice || company.taxNumber ? `<div>${escapeHtml(company.taxOffice)} ${escapeHtml(company.taxNumber)}</div>` : ""}
              </div>
            </div>
            <div class="row"><div><label>Teklif No</label><span>${escapeHtml(offer.teklifNo)}</span></div><div><label>Durum</label><span>${escapeHtml(offer.durum)}</span></div></div>
            <div class="row"><div><label>Müşteri</label><span>${escapeHtml(offer.musteri)}</span></div><div><label>Şehir</label><span>${escapeHtml(offer.sehir)}</span></div></div>
            <div class="row"><div><label>Tarih</label><span>${escapeHtml(offer.tarih)}</span></div><div><label>Geçerlilik</label><span>${escapeHtml(offer.gecerlilik)}</span></div></div>
            <div class="row"><div style="flex:1"><label>Tutar</label><span>${escapeHtml(offer.tutar)}</span></div></div>
            <div class="footer">Bu teklif ${companyName} tarafından oluşturulmuştur.</div>
          </div>
        </div>
      </body>
      </html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  };

  const saveModal = () => {
    if (!modal || modal.type === "Detay") return setModal(null);
    if (modal.type === "Sil") {
      setData((prev) => ({
        ...prev,
        [modal.module]: prev[modal.module].filter((x) => x.id !== modal.record.id),
      }));
      setModal(null);
      return;
    }

    setData((prev) => {
      const list = prev[modal.module] || [];
      if (modal.type === "Yeni Kayıt") {
        return { ...prev, [modal.module]: [{ ...modal.values, id: Date.now() }, ...list] };
      }
      return {
        ...prev,
        [modal.module]: list.map((x) => (x.id === modal.record.id ? { ...modal.values, id: x.id } : x)),
      };
    });
    setModal(null);
  };

  const sendAI = () => {
    const text = aiInput.trim();
    if (!text) return;
    let answer = "Demo analiz: ";
    const lower = text.toLowerCase();

    if (lower.includes("stok")) answer += "Kritik stokta Fungisit X200 ve DAP Gübre görünüyor. En kısa sürede tedarik önerilir.";
    else if (lower.includes("borç") || lower.includes("borc")) answer += `Cari hesap analizi: Toplam borç ₺${data.accounts.reduce((s,a)=>s+Number(String(a.borc).replace(/[^0-9]/g,'')),0).toLocaleString('tr-TR')}, en yüksek borçlu: ${data.accounts.reduce((a,b)=>{ const nb = Number(String(b.borc).replace(/[^0-9]/g,'')); return nb> (a.val||0)? {id:b.id,name:b.musteri,val:nb}:a},{}) .name || '—' }.`;
    else if (lower.includes("müşteri") || lower.includes("risk")) answer += "Marmara Seracılık ödeme gecikmesi nedeniyle riskli müşteri olarak işaretlendi.";
    else if (lower.includes("tarla") || lower.includes("ilaç")) answer += "Zeynep Arslan Domates Serası için mantar kontrolü gecikmiş görünüyor.";
    else if (lower.includes("satış")) answer += "Bu ay en güçlü satış fırsatı Ege Tarım A.Ş. ve Güneydoğu Tarım Grubu tarafında.";
    else answer += "Satış, stok, cari hesap ve tarla uygulamalarında takip edilebilir bir işlem görünüyor.";

    setChat((prev) => [...prev, { from: "user", text }, { from: "ai", text: answer }]);
    setAiInput("");
  };

  const rows = data[page] || [];
  const filteredRows = useMemo(() => {
    return rows.filter((r) => Object.values(r).join(" ").toLowerCase().includes(search.toLowerCase()));
  }, [rows, search]);

  const dashboard = () => {
    const totalSales = salesData.reduce((sum, item) => sum + item.value, 0);
    const donutColors = ["#16a34a", "#15803d", "#22c55e", "#4d7c0f", "#65a30d", "#4ade80"];
    const donutGradient = salesData.reduce(
      (acc, item, i) => {
        const start = acc.current;
        const percentage = (item.value / totalSales) * 100;
        const end = start + percentage;
        acc.segments.push(`${donutColors[i % donutColors.length]} ${start}% ${end}%`);
        acc.current = end;
        return acc;
      },
      { current: 0, segments: [] }
    ).segments.join(", ");

    return (
      <>
        <section className="stats four">
          <div className="stat"><span>Toplam Satış (6 ay)</span><b>{formatMoney(totalSales)}</b></div>
          <div className="stat"><span>En Yüksek Ay</span><b>{highestMonth()}</b></div>
          <div className="stat"><span>Ortalama Satış</span><b>{formatMoney(Math.round(totalSales / salesData.length))}</b></div>
          <div className="stat"><span>Kritik Stok</span><b>{alerts.length}</b></div>
        </section>

        <section className="dashGrid">
          <div className="panel chartPanel">
            <h3>Aylık Satış Grafiği</h3>
            <div className="donutSection">
              <div className="donutChart" style={{ background: `conic-gradient(${donutGradient})` }}>
                <div className="donutCenter">
                  <strong>{formatMoney(totalSales)}</strong>
                  <span>Toplam Satış</span>
                </div>
              </div>
              <div className="donutLegend">
                {salesData.map((s, i) => (
                  <div key={s.month} className="legendItem">
                    <div className="legendInfo">
                      <span className="legendDot" style={{ background: donutColors[i % donutColors.length] }} />
                      <span>{s.month}</span>
                    </div>
                    <span className="legendValue">{formatMoney(s.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel warningsPanel">
            <h3>Kritik Uyarılar</h3>
            {alerts.map((a) => (
              <div key={a.id} className="warning" onClick={() => openModal("Uyarı Detayı", "alerts", a)}>
                <AlertTriangle size={16} />
                <div className="warningBody">
                  <b>{a.type}</b>
                  <span>{a.text}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      <section className="panel">
        <div className="panelHead"><h3>Son Siparişler</h3></div>
        {renderTable("orders", data.orders, false)}
      </section>
    </>
  );
  };

  function formatMoney(v) { return `₺${v.toLocaleString('tr-TR')}`; }
  function highestMonth() { const max = Math.max(...salesData.map((x) => x.value)); const item = salesData.find((x) => x.value === max); return `${item.month} (${formatMoney(item.value)})`; }

  const farmerCards = () => (
    <>
      <div className="profileGrid">
        {filteredRows.map((f) => (
          <div className="farmerCard" key={f.id}>
            <div className="avatar"><Sprout size={24} /></div>
            <h3>{f.ciftci}</h3>
            <p>{f.telefon}</p>
            <div className="miniStats">
              <span>{f.toplamTarla} Tarla</span>
              <span>{f.dekar} Dekar</span>
              <span>{f.bakiye}</span>
            </div>
            <div className="history">
              <b>Son Uygulama</b>
              <p>{f.tarla} → {f.sonUrun}</p>
              <b>Sonraki İşlem</b>
              <p>{f.sonraki}</p>
            </div>
            <div className="actions">
              <button onClick={() => openModal("Detay", "farmerCards", f)}><Eye size={14} /></button>
              <button onClick={() => openModal("Düzenle", "farmerCards", f)}><Pencil size={14} /></button>
              <button onClick={() => sendWhatsApp(f)}><MessageCircle size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const calendarPage = () => (
    <div>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        {["Bugün", "Bu Hafta", "Geciken"].map((t) => (
          <button key={t} className={calendarTab===t? 'primary' : ''} onClick={() => setCalendarTab(t)}>{t}</button>
        ))}
        <button style={{marginLeft:'auto'}} onClick={() => openModal('Yeni Kayıt','calendar')}>Yeni İşlem Ekle</button>
      </div>
      <div className="calendarGrid">
        {(data.calendar.filter((r) => (calendarTab==='Tümü' ? true : r.zaman === calendarTab))).map((r) => (
          <div className="panel taskCard" key={r.id}>
            <h4>{r.islem}</h4>
            <p>{r.ciftci} / {r.tarla}</p>
            <p className={`status ${r.zaman==='Geciken' || r.durum==='Acil' ? 'danger' : ''}`}>{r.durum}</p>
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <button onClick={() => openModal('Detay','calendar',r)}>Detay</button>
              <button onClick={() => {
                setData((prev)=>({ ...prev, calendar: prev.calendar.map(x=> x.id===r.id?{...x,durum:'Tamamlandı'}:x) }));
              }}>Tamamlandı</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const barcodePage = () => (
    <>
      <section className="barcodeTools">
        <button className="primary" onClick={() => openModal("Yeni Kayıt", "barcode")}><Plus size={15} /> Barkod Oluştur</button>
        <button onClick={() => alert("Demo: QR kod önizleme hazırlandı.")}><QrCode size={15} /> QR Kod</button>
        <button onClick={() => alert("Demo: Yazdırma ekranı açıldı.")}><Printer size={15} /> Yazdır</button>
        <button onClick={() => alert("Demo: Stok giriş/çıkış işlemi başlatıldı.")}><ArrowDownUp size={15} /> Stok Hareketi</button>
      </section>
      <section className="barcodeGrid">
        {filteredRows.map((b) => (
          <div className="barcodeCard" key={b.id}>
            <div className="fakeBarcode">{b.barkod}</div>
            <h3>{b.urun}</h3>
            <p>{b.lot} / {b.stok}</p>
            <span className="badge">{b.durum}</span>
            <div className="actions">
              <button onClick={() => openModal("Detay", "barcode", b)}><Eye size={14} /></button>
              <button onClick={() => openModal("Düzenle", "barcode", b)}><Pencil size={14} /></button>
              <button onClick={() => alert("Demo: Barkod yazdırılıyor.")}><Printer size={14} /></button>
            </div>
          </div>
        ))}
      </section>
    </>
  );

  const companySettingsPage = () => (
    <section className="panel companySettingsPanel">
      <div className="panelHead">
        <h3>{pageInfo.companySettings[0]}</h3>
      </div>
      <div className="companySettingsForm">
        <label>
          Firma Adı
          <input value={company.name} onChange={(e) => setCompany((prev) => ({ ...prev, name: e.target.value }))} placeholder="Firma adı" />
        </label>
        <label>
          Logo URL
          <input value={company.logo} onChange={(e) => setCompany((prev) => ({ ...prev, logo: e.target.value }))} placeholder="https://..." />
        </label>
        <label>
          Logo Yükleme
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            resizeImageFile(file, 220, 120)
              .then((resized) => setCompany((prev) => ({ ...prev, logo: resized })))
              .catch(() => {
                const reader = new FileReader();
                reader.onload = () => setCompany((prev) => ({ ...prev, logo: reader.result || prev.logo }));
                reader.readAsDataURL(file);
              });
          }} />
        </label>
        <button type="button" className="primary" onClick={saveCompanySettings} style={{ gridColumn: "1 / -1", justifySelf: "start" }}>
          Kaydet
        </button>
        <label>
          Telefon
          <input value={company.phone} onChange={(e) => setCompany((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Telefon" />
        </label>
        <label>
          E-posta
          <input value={company.email} onChange={(e) => setCompany((prev) => ({ ...prev, email: e.target.value }))} placeholder="E-posta" />
        </label>
        <label>
          Adres
          <input value={company.address} onChange={(e) => setCompany((prev) => ({ ...prev, address: e.target.value }))} placeholder="Adres" />
        </label>
        <label>
          Vergi Dairesi
          <input value={company.taxOffice} onChange={(e) => setCompany((prev) => ({ ...prev, taxOffice: e.target.value }))} placeholder="Vergi Dairesi" />
        </label>
        <label>
          Vergi No
          <input value={company.taxNumber} onChange={(e) => setCompany((prev) => ({ ...prev, taxNumber: e.target.value }))} placeholder="Vergi No" />
        </label>
      </div>
      {company.logo && (
        <div className="companySettingsPreview">
          <h4>Logo Önizleme</h4>
          <img src={company.logo} alt="Logo Önizleme" />
        </div>
      )}
    </section>
  );

  const aiPage = () => (
    <section className="panel aiPanel">
      <h3>Akıllı Tarım Asistanı</h3>
      <div className="chatBox">
        {chat.map((m, i) => <div key={i} className={`msg ${m.from}`}>{m.text}</div>)}
      </div>
      <div className="aiSend">
        <input
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendAI()}
          placeholder="Örn: Kritik stokları göster..."
        />
        <button className="primary" onClick={sendAI}><Send size={15} /> Gönder</button>
      </div>
    </section>
  );

  function renderTable(module, customRows = filteredRows, includePanel = true) {
    const keys = schemaFor(module);
    const showRows = customRows.filter((r) => {
      if (tableFilter === "Tümü") return true;
      if (tableFilter === "Aktif") return String(r.durum || '').toLowerCase().includes('aktif');
      if (tableFilter === "Bekliyor") return String(r.durum || '').toLowerCase().includes('bekli') || String(r.durum||'').toLowerCase().includes('haz');
      if (tableFilter === "Kritik") return String(r.durum || '').toLowerCase().includes('kritik') || String(r.durum || '').toLowerCase().includes('gec') || String(r.durum||'').toLowerCase().includes('acil');
      return true;
    });
    const table = (
      <table>
        <thead>
          <tr>
            {keys.map((k) => <th key={k}>{label(k)}</th>)}
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {showRows.map((row) => (
            <tr key={row.id}>
              {keys.map((k) => (
                <td key={k} className={moneyCell(k) ? "money" : ""}>
                  {statusCell(k) ? <span className="badge">{row[k]}</span> : row[k]}
                </td>
              ))}
              <td className="actions">
                <button onClick={() => openModal("Detay", module, row)}><Eye size={14} /></button>
                <button onClick={() => openModal("Düzenle", module, row)}><Pencil size={14} /></button>
                <button onClick={() => sendWhatsApp(row)}><MessageCircle size={14} /></button>
              {module === "offers" && (
                <button className="pdfButton" onClick={() => openOfferPdf(row)}><Printer size={14} /> PDF</button>
              )}
                <button onClick={() => openModal("Sil", module, row)}><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    if (!includePanel) return table;

    return (
      <section className="panel">
        <div className="panelHead">
          <h3>{pageInfo[module]?.[0] || "Liste"}</h3>
          <div className="tabs">
            {['Tümü','Aktif','Bekliyor','Kritik'].map((t)=> (
              <button key={t} className={tableFilter===t? 'selected' : ''} onClick={()=>setTableFilter(t)}>{t}</button>
            ))}
          </div>
          <div className="search"><Search size={14} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ara..." /></div>
        </div>
        <div className="tableContainer">{table}</div>
      </section>
    );
  }

  const content = () => {
    if (page === "dashboard") return dashboard();
    if (page === "farmerCards") return farmerCards();
    if (page === "calendar") return calendarPage();
    if (page === "barcode") return barcodePage();
    if (page === "companySettings") return companySettingsPage();
    if (page === "ai") return aiPage();
    return renderTable(page);
  };

  const currentTitle = page === "dashboard" ? "Gösterge Paneli" : pageInfo[page]?.[0] || "Teklifler";
  const currentDesc = page === "dashboard" ? "Sisteme genel bakış ve temel metrikler." : pageInfo[page]?.[1] || "Kayıtları yönetin.";

  return (
    <div className="app">
      <aside>
        <div className="logo">🌱 <span>AgroPilot</span></div>
        {menuGroups.map((group) => (
          <div className="group" key={group.title}>
            <small>{group.title}</small>
            {group.items.map(([id, title, Icon]) => (
              <button key={id} onClick={() => { setPage(id); setSearch(""); setTableFilter('Tümü'); setMobileMenuOpen(false); }} className={page === id ? "active" : ""}>
                <Icon size={15} /> {title}
              </button>
            ))}
          </div>
        ))}
      </aside>

      <main>
        <header>
          <button className="menuToggle" onClick={() => setMobileMenuOpen((prev) => !prev)}>
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div>
            <h1>{currentTitle}</h1>
            <p>{currentDesc}</p>
          </div>
          {page !== "dashboard" && page !== "ai" && page !== "companySettings" && (
            <button className="primary" onClick={() => openModal("Yeni Kayıt", page)}>
              <Plus size={15} /> Yeni Ekle
            </button>
          )}
        </header>

        {page !== "dashboard" && page !== "ai" && page !== "companySettings" && (
          <section className="stats">
            <div className="stat"><span>Toplam Kayıt</span><b>{rows.length}</b></div>
            <div className="stat"><span>Aktif İşlem</span><b>{Math.max(1, rows.length - 1)}</b></div>
            <div className="stat"><span>Güncel Durum</span><b>Takipte</b></div>
          </section>
        )}

        {content()}
      </main>

      {modal && (
        <div className="modal">
          <div className="modalBox">
            <button className="close" onClick={() => setModal(null)}><X size={16} /></button>
            <h2>{modal.type}</h2>
            <p className="modalDesc">{pageInfo[modal.module]?.[0] || "Kayıt"} işlem paneli</p>

            {modal.type === "Sil" ? (
              <div className="deleteBox">
                <AlertTriangle size={32} />
                <p>Bu kaydı silmek istediğine emin misin?</p>
              </div>
            ) : modal.module === 'alerts' && modal.type === 'Uyarı Detayı' ? (
              <div style={{padding:12}}>
                <h3>{modal.record.type}</h3>
                <p>{modal.record.text}</p>
                <div style={{display:'flex',gap:8,marginTop:12}}>
                  <button className="primary" onClick={() => {
                    setAlerts((prev) => prev.filter(a => a.id !== modal.record.id));
                    setModal(null);
                  }}>Çözüldü</button>
                  <button onClick={() => { openModal('Detay', modal.record.related.module, data[modal.record.related.module].find(x=>x.id===modal.record.related.id)); }}>İlgili Kayıt</button>
                </div>
              </div>
            ) : (
              schemaFor(modal.module).map((field) => (
                <label key={field}>
                  {label(field)}
                  {field === "durum" ? (
                    <select
                      disabled={modal.type === "Detay"}
                      value={modal.values[field] || ""}
                      onChange={(e) => setModal({ ...modal, values: { ...modal.values, [field]: e.target.value } })}
                    >
                      <option>Aktif</option>
                      <option>Bekliyor</option>
                      <option>Planlandı</option>
                      <option>Uygulandı</option>
                      <option>Kritik</option>
                      <option>Takipte</option>
                      <option>Tamamlandı</option>
                    </select>
                  ) : (
                    <input
                      disabled={modal.type === "Detay"}
                      value={modal.values[field] || ""}
                      onChange={(e) => setModal({ ...modal, values: { ...modal.values, [field]: e.target.value } })}
                    />
                  )}
                </label>
              ))
            )}

            <div className="modalActions">
              <button className="primary" onClick={saveModal}>
                {modal.type === "Sil" ? "Sil" : modal.type === "Detay" ? "Tamam" : "Kaydet"}
              </button>
              <button onClick={() => setModal(null)}>Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function label(key) {
  const map = {
    firma: "Firma", sehir: "Şehir", telefon: "Telefon", ciro: "Ciro", durum: "Durum",
    bayi: "Bayi", bolge: "Bölge", yetkili: "Yetkili", satis: "Satış",
    urun: "Ürün", kategori: "Kategori", lot: "Lot No", parti: "Parti No", skt: "SKT", stok: "Stok",
    depo: "Depo", giris: "Giriş", cikis: "Çıkış", kalan: "Kalan",
    no: "No", musteri: "Müşteri", tutar: "Tutar", tarih: "Tarih",
    borc: "Borç", alacak: "Alacak", bakiye: "Bakiye",
    tahsilatNo: "Tahsilat No", yontem: "Yöntem",
    hesap: "Hesap", tip: "Tip", hareket: "Hareket",
    teklifNo: "Teklif No", gecerlilik: "Geçerlilik",
    ciftci: "Çiftçi", tarla: "Tarla", toplamTarla: "Tarla Sayısı", dekar: "Dekar", sonUrun: "Son Ürün", sonraki: "Sonraki İşlem",
    doz: "Doz", uygulama: "Uygulama", zaman: "Zaman", islem: "İşlem", barkod: "Barkod No",
  };
  return map[key] || key;
}

function moneyCell(key) {
  return ["tutar", "ciro", "borc", "alacak", "bakiye", "satis"].includes(key);
}

function statusCell(key) {
  return ["durum"].includes(key);
}

export default App;
