
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
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppIcon = ({ size = 18 }) => <FaWhatsapp size={size} />;

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
      ["dashboard", "GÃ¶sterge Paneli", LayoutDashboard],
      ["customers", "MÃ¼ÅŸteriler", Users],
      ["dealers", "Bayiler", Store],
      ["products", "ÃœrÃ¼nler", Package],
      ["inventory", "Envanter", Boxes],
      ["orders", "SipariÅŸler", ShoppingCart],
    ],
  },
  {
    title: "FÄ°NANS",
    items: [
      ["accounts", "Cari Hesap", Wallet],
      ["collections", "Tahsilatlar", ReceiptText],
      ["cashbank", "Kasa & Banka", Banknote],
      ["offers", "Teklifler", FileText],
      ["deliveries", "Teslimatlar", Package],
      ["cekTakibi", "Ã‡ek Takibi", Banknote],
      ["senetTakibi", "Senet Takibi", ReceiptText],
      ["companySettings", "Firma AyarlarÄ±", Settings],
    ],
  },
  {
    title: "TARIMSAL",
    items: [
      ["farmerCards", "Ã‡iftÃ§i KartÄ±", Users],
      ["fieldTracking", "Tarla Takibi", MapPinned],
      ["calendar", "Periyodik Takvim", CalendarDays],
      ["barcode", "Barkod YÃ¶netimi", Barcode],
    ],
  },
  {
    title: "ZEKA",
    items: [["ai", "Yapay Zeka AsistanÄ±", Bot]],
  },
];

const initialData = {
  customers: [
    { id: 1, firma: "Ahmet YÄ±lmaz TarÄ±m", sehir: "Adana", telefon: "0532 451 2234", ciro: "â‚º124.500", durum: "Aktif" },
    { id: 2, firma: "Ege TarÄ±m A.Å.", sehir: "Ä°zmir", telefon: "0232 445 6789", ciro: "â‚º512.000", durum: "Aktif" },
    { id: 3, firma: "Marmara SeracÄ±lÄ±k Ltd.", sehir: "Bursa", telefon: "0226 445 7788", ciro: "â‚º67.800", durum: "Takipte" },
  ],
  dealers: [
    { id: 1, bayi: "Ã‡ukurova Zirai Bayi", bolge: "Akdeniz", yetkili: "Serkan Usta", satis: "â‚º210.000", durum: "Aktif" },
    { id: 2, bayi: "Ege Zirai Tedarik", bolge: "Ege", yetkili: "Canan Aksoy", satis: "â‚º145.000", durum: "Aktif" },
    { id: 3, bayi: "Trakya TarÄ±m NoktasÄ±", bolge: "Marmara", yetkili: "Hakan YÄ±ldÄ±z", satis: "â‚º92.000", durum: "Pasif" },
  ],
  products: [
    { id: 1, urun: "DAP GÃ¼bre", kategori: "GÃ¼bre", lot: "LOT-245", parti: "PRT-12", skt: "2027", stok: "520 Adet", durum: "Aktif" },
    { id: 2, urun: "Fungisit X200", kategori: "Ä°laÃ§", lot: "LOT-881", parti: "PRT-44", skt: "2026", stok: "74 Adet", durum: "Kritik" },
    { id: 3, urun: "Potasyum Nitrat", kategori: "Besin", lot: "LOT-109", parti: "PRT-09", skt: "2028", stok: "112 Adet", durum: "Aktif" },
  ],
  inventory: [
    { id: 1, depo: "Merkez Depo", urun: "DAP GÃ¼bre", giris: "800", cikis: "280", kalan: "520", durum: "Normal" },
    { id: 2, depo: "Adana Depo", urun: "Fungisit X200", giris: "120", cikis: "46", kalan: "74", durum: "Kritik" },
    { id: 3, depo: "Mersin Depo", urun: "Potasyum Nitrat", giris: "250", cikis: "138", kalan: "112", durum: "Normal" },
  ],
  orders: [
    { id: 1, no: "SIP-0007", musteri: "Ege TarÄ±m A.Å.", tutar: "â‚º91.000", tarih: "02.06.2026", durum: "HazÄ±rlanÄ±yor" },
    { id: 2, no: "SIP-0012", musteri: "Ahmet YÄ±lmaz TarÄ±m", tutar: "â‚º48.500", tarih: "04.06.2026", durum: "HazÄ±rlanÄ±yor" },
    { id: 3, no: "SIP-0018", musteri: "Marmara SeracÄ±lÄ±k", tutar: "â‚º22.300", tarih: "05.06.2026", durum: "Bekliyor" },
    { id: 4, no: "SIP-0021", musteri: "Karadeniz TarÄ±m Kooperatifi", tutar: "â‚º67.200", tarih: "01.06.2026", durum: "Gecikti" },
  ],
  accounts: [
    { id: 1, musteri: "Ahmet YÄ±lmaz TarÄ±m", borc: "â‚º24.500", alacak: "â‚º0", bakiye: "â‚º24.500", durum: "BorÃ§lu" },
    { id: 2, musteri: "Ege TarÄ±m A.Å.", borc: "â‚º0", alacak: "â‚º18.000", bakiye: "â‚º18.000", durum: "AlacaklÄ±" },
    { id: 3, musteri: "Marmara SeracÄ±lÄ±k", borc: "â‚º11.200", alacak: "â‚º0", bakiye: "â‚º11.200", durum: "Takipte" },
  ],
  collections: [
    { id: 1, tahsilatNo: "TAH-0012", musteri: "Marmara SeracÄ±lÄ±k", tutar: "â‚º22.300", yontem: "Havale", tarih: "05.06.2026", durum: "AlÄ±ndÄ±" },
    { id: 2, tahsilatNo: "TAH-0013", musteri: "Ahmet YÄ±lmaz TarÄ±m", tutar: "â‚º15.000", yontem: "Nakit", tarih: "06.06.2026", durum: "Bekliyor" },
  ],
  cashbank: [
    { id: 1, hesap: "Nakit Kasa", tip: "Kasa", bakiye: "â‚º84.500", hareket: "GÃ¼nlÃ¼k", durum: "Aktif" },
    { id: 2, hesap: "Ziraat BankasÄ±", tip: "Banka", bakiye: "â‚º412.000", hareket: "AylÄ±k", durum: "Aktif" },
    { id: 3, hesap: "Giderler", tip: "Gider", bakiye: "â‚º31.000", hareket: "AylÄ±k", durum: "Kontrol" },
  ],
  offers: [
    { id: 1, teklifNo: "TEK-2026-001", musteri: "Ege TarÄ±m A.Å.", sehir: "Ä°zmir", tarih: "28.05.2026", gecerlilik: "28.06.2026", tutar: "â‚º145.000", durum: "HazÄ±rlanÄ±yor" },
    { id: 2, teklifNo: "TEK-2026-002", musteri: "Karadeniz TarÄ±m Kooperatifi", sehir: "Trabzon", tarih: "01.06.2026", gecerlilik: "01.07.2026", tutar: "â‚º88.500", durum: "Bekliyor" },
    { id: 3, teklifNo: "TEK-2026-003", musteri: "GÃ¼neydoÄŸu TarÄ±m Grubu", sehir: "ÅanlÄ±urfa", tarih: "20.05.2026", gecerlilik: "20.06.2026", tutar: "â‚º210.000", durum: "Gecikti" },
    { id: 4, teklifNo: "TEK-2026-004", musteri: "Trakya BuÄŸday Ãœreticileri Bir.", sehir: "Edirne", tarih: "02.06.2026", gecerlilik: "02.07.2026", tutar: "â‚º67.000", durum: "Ä°ptal" },
  ],
  deliveries: [
    { id: 1, teslimNo: "TES-0001", musteri: "Ege TarÄ±m A.Å.", telefon: "0232 445 6789", teslimTarihi: "05.06.2026", teslimEden: "Ali YÄ±lmaz", teslimAlan: "Mehmet AydÄ±n", urun: "DAP GÃ¼bre", urunTipi: "GÃ¼bre", miktar: "25", birim: "Ã‡uval", lot: "LOT-245", parti: "PRT-12", skt: "2027", tarla: "Biber TarlasÄ±", dekar: "120", kullanimAmaci: "GÃ¼breleme", aciklama: "Acil teslimat", teslimDurumu: "Teslim Edildi" },
  ],
  cekTakibi: [
    { id: 1, cekNo: "CHK-001", musteri: "Marmara SeracÄ±lÄ±k", banka: "Ziraat BankasÄ±", sube: "Merkez", vadeTarihi: "15.06.2026", tutar: "â‚º45.000", durum: "Bekliyor", aciklama: "Firma Ã§ek" },
  ],
  senetTakibi: [
    { id: 1, senetNo: "SNT-001", borclu: "Ahmet YÄ±lmaz", alacakli: "Ege TarÄ±m A.Å.", vadeTarihi: "20.06.2026", tutar: "â‚º28.000", durum: "Gecikti", aciklama: "Borcun takibi" },
  ],
  farmerCards: [
    { id: 1, ciftci: "Ahmet YÄ±lmaz", telefon: "0532 451 2234", tarla: "Biber TarlasÄ±", toplamTarla: "3", dekar: "120", bakiye: "â‚º24.500 BorÃ§", sonUrun: "DAP GÃ¼bre", sonraki: "15 gÃ¼n sonra kontrol" },
    { id: 2, ciftci: "Mehmet Demir", telefon: "0541 778 0099", tarla: "BuÄŸday TarlasÄ±", toplamTarla: "2", dekar: "80", bakiye: "â‚º8.300 Alacak", sonUrun: "SÄ±vÄ± GÃ¼bre", sonraki: "10 gÃ¼n sonra uygulama" },
    { id: 3, ciftci: "Zeynep Arslan", telefon: "0530 221 1122", tarla: "Domates SerasÄ±", toplamTarla: "1", dekar: "12", bakiye: "â‚º0", sonUrun: "Fungisit X200", sonraki: "7 gÃ¼n sonra kontrol" },
  ],
  fieldTracking: [
    { id: 1, ciftci: "Ahmet YÄ±lmaz", tarla: "Biber TarlasÄ±", urun: "DAP GÃ¼bre", doz: "25 kg/da", uygulama: "12.05.2026", sonraki: "27.05.2026", durum: "UygulandÄ±" },
    { id: 2, ciftci: "Mehmet Demir", tarla: "BuÄŸday TarlasÄ±", urun: "SÄ±vÄ± GÃ¼bre", doz: "2 lt/da", uygulama: "14.05.2026", sonraki: "24.05.2026", durum: "PlanlandÄ±" },
    { id: 3, ciftci: "Zeynep Arslan", tarla: "Domates SerasÄ±", urun: "Fungisit X200", doz: "150 gr/100 L", uygulama: "16.05.2026", sonraki: "23.05.2026", durum: "Gecikti" },
  ],
  calendar: [
    { id: 1, zaman: "BugÃ¼n", ciftci: "Ahmet YÄ±lmaz", islem: "Ä°laÃ§lama kontrolÃ¼", tarla: "Biber TarlasÄ±", durum: "Bekliyor" },
    { id: 2, zaman: "Bu Hafta", ciftci: "Mehmet Demir", islem: "2. gÃ¼breleme", tarla: "BuÄŸday TarlasÄ±", durum: "PlanlandÄ±" },
    { id: 3, zaman: "Geciken", ciftci: "Zeynep Arslan", islem: "Mantar kontrolÃ¼", tarla: "Domates SerasÄ±", durum: "Acil" },
  ],
  barcode: [
    { id: 1, barkod: "8690001234567", urun: "DAP GÃ¼bre", lot: "LOT-245", stok: "250 Adet", islem: "YazdÄ±r", durum: "Aktif" },
    { id: 2, barkod: "8690007654321", urun: "Fungisit X200", lot: "LOT-881", stok: "74 Adet", islem: "QR OluÅŸtur", durum: "Kritik" },
    { id: 3, barkod: "8690005553322", urun: "Potasyum Nitrat", lot: "LOT-109", stok: "112 Adet", islem: "Stok GiriÅŸ", durum: "Aktif" },
  ],
};

const pageInfo = {
  customers: ["MÃ¼ÅŸteriler", "MÃ¼ÅŸteri kayÄ±tlarÄ±nÄ± ve iletiÅŸim bilgilerini yÃ¶netin."],
  dealers: ["Bayiler", "BÃ¶lge bayi performanslarÄ±nÄ± takip edin."],
  products: ["ÃœrÃ¼nler", "GÃ¼bre, ilaÃ§, tohum ve besin Ã¼rÃ¼nlerini yÃ¶netin."],
  inventory: ["Envanter", "Depo giriÅŸ Ã§Ä±kÄ±ÅŸ ve kritik stoklarÄ± takip edin."],
  orders: ["SipariÅŸler", "SipariÅŸ durumlarÄ±nÄ± ve satÄ±ÅŸ sÃ¼recini yÃ¶netin."],
  accounts: ["Cari Hesap", "MÃ¼ÅŸteri alacak, borÃ§ ve bakiye takibi."],
  collections: ["Tahsilatlar", "Ã–deme ve tahsilat hareketlerini takip edin."],
  cashbank: ["Kasa & Banka", "Kasa, banka, gelir ve gider Ã¶zetleri."],
  offers: ["Teklifler", "MÃ¼ÅŸteri tekliflerini oluÅŸturun ve takip edin."],
  deliveries: ["Teslimatlar", "SipariÅŸ teslimatlarÄ±nÄ± ve tutanaklarÄ± yÃ¶netin."],
  cekTakibi: ["Ã‡ek Takibi", "Ã‡eklerin vade, durum ve cari iliÅŸkisinin takibini yapÄ±n."],
  senetTakibi: ["Senet Takibi", "Senetlerin vadesini ve tahsil durumunu izleyin."],
  companySettings: ["Firma AyarlarÄ±", "Teklif PDF'leri iÃ§in ÅŸirket bilgilerini gÃ¼ncelleyin."],
  farmerCards: ["Ã‡iftÃ§i KartÄ±", "Ã‡iftÃ§inin tÃ¼m geÃ§miÅŸini tek ekranda gÃ¶rÃ¼ntÃ¼leyin."],
  fieldTracking: ["Tarla Takibi", "Hangi tarlaya hangi Ã¼rÃ¼n verildiÄŸini takip edin."],
  calendar: ["Periyodik Takvim", "YaklaÅŸan ve geciken tarÄ±msal iÅŸlemleri yÃ¶netin."],
  barcode: ["Barkod YÃ¶netimi", "Barkod, QR kod, stok giriÅŸ ve Ã§Ä±kÄ±ÅŸ iÅŸlemleri."],
};

function App() {
  const [page, setPage] = useState("dashboard");
  const [data, setData] = useState(() => {
    if (typeof window === "undefined") return initialData;
    try {
      const stored = window.localStorage.getItem("agropilot_data");
      if (!stored) return initialData;
      const parsed = JSON.parse(stored);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return initialData;
      return { ...initialData, ...parsed };
    } catch {
      return initialData;
    }
  });
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [chat, setChat] = useState([
    { from: "ai", text: "Merhaba, stok, mÃ¼ÅŸteri, satÄ±ÅŸ ve tarla iÅŸlemleri hakkÄ±nda soru sorabilirsin." },
    { from: "ai", text: "Ã–neri: DAP GÃ¼bre kritik seviyeye yaklaÅŸÄ±yor. Yeni sipariÅŸ aÃ§Ä±lmalÄ±." },
  ]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("agropilot_data", JSON.stringify(data));
  }, [data]);

  const [salesData, setSalesData] = useState([
    { month: "Oca", value: 38500 },
    { month: "Åub", value: 52000 },
    { month: "Mar", value: 45000 },
    { month: "Nis", value: 70000 },
    { month: "May", value: 62000 },
    { month: "Haz", value: 88000 },
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, type: "Kritik Stok", text: "Fungisit X200 stoÄŸu kritik.", related: { module: "inventory", id: 2 } },
    { id: 2, type: "Geciken Tarla Ä°ÅŸlemi", text: "Zeynep Arslan tarla kontrolÃ¼ gecikti.", related: { module: "fieldTracking", id: 3 } },
    { id: 3, type: "Cari Takip", text: "Marmara SeracÄ±lÄ±k Ã¶deme gecikmesi.", related: { module: "accounts", id: 3 } },
  ]);

  const [tableFilter, setTableFilter] = useState("TÃ¼mÃ¼");
  const [calendarTab, setCalendarTab] = useState("BugÃ¼n");
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
    alert("Firma ayarlarÄ± kaydedildi");
  };

  const normalizeWhatsAppNumber = (phone = "") => {
    const digits = String(phone).replace(/\D/g, "");
    if (!digits) return "";
    if (digits.length === 10) return `90${digits}`;
    if (digits.length === 11 && digits.startsWith("0")) return `9${digits}`;
    if (digits.length === 11 && digits.startsWith("9")) return digits;
    if (digits.length === 12 && digits.startsWith("90")) return digits;
    return digits;
  };

  const sendWhatsApp = (record = {}) => {
    const phone = normalizeWhatsAppNumber(record.telefon || record.phone || "");
    const url = phone ? `https://wa.me/${phone}` : `https://wa.me/905451712019`;
    window.open(url, "_blank");
  };

  const deleteFarmerRecord = (record = {}) => {
    if (!record?.id) return;
    if (window.confirm("Bu Ã§iftÃ§i kaydÄ±nÄ± silmek istediÄŸinize emin misiniz?")) {
      setData((prev) => ({
        ...prev,
        farmerCards: prev.farmerCards.filter((item) => item.id !== record.id),
      }));
    }
  };

  const schemaFor = (module) => {
    // Prefer custom schemas for specific modules
    const custom = {
      farmerCards: ["ciftci", "telefon", "tarla", "dekar", "bakiye", "sonUrun", "sonraki"],
      barcode: ["barkod", "urun", "lot", "stok", "islem"],
      accounts: ["musteri", "borc", "alacak", "bakiye", "durum"],
      fieldTracking: ["ciftci", "tarla", "urun", "doz", "uygulama", "sonraki", "durum"],
      calendar: ["zaman", "ciftci", "islem", "tarla", "durum"],
      deliveries: ["teslimNo", "musteri", "telefon", "teslimTarihi", "teslimEden", "teslimAlan", "urun", "urunTipi", "miktar", "birim", "lot", "parti", "skt", "tarla", "dekar", "kullanimAmaci", "aciklama", "teslimDurumu"],
      cekTakibi: ["cekNo", "musteri", "banka", "sube", "vadeTarihi", "tutar", "durum", "aciklama"],
      senetTakibi: ["senetNo", "borclu", "alacakli", "vadeTarihi", "tutar", "durum", "aciklama"],
    };
    if (custom[module]) return custom[module];
    const sample = data[module]?.[0] || {};
    return Object.keys(sample).filter((k) => k !== "id");
  };

  const openModal = (type, module, record = null, initialValues = null, meta = null) => {
    const fields = schemaFor(module);
    const values = initialValues || (record ? { ...record } : Object.fromEntries(fields.map((f) => [f, ""])));
    setModal({ type, module, record, values, meta });
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
        <title>Teklif Ã–nizleme - ${escapeHtml(offer.teklifNo)}</title>
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
            <button class="printBtn" onclick="window.print();">YazdÄ±r / PDF Ä°ndir</button>
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
            <div class="row"><div><label>MÃ¼ÅŸteri</label><span>${escapeHtml(offer.musteri)}</span></div><div><label>Åehir</label><span>${escapeHtml(offer.sehir)}</span></div></div>
            <div class="row"><div><label>Tarih</label><span>${escapeHtml(offer.tarih)}</span></div><div><label>GeÃ§erlilik</label><span>${escapeHtml(offer.gecerlilik)}</span></div></div>
            <div class="row"><div style="flex:1"><label>Tutar</label><span>${escapeHtml(offer.tutar)}</span></div></div>
            <div class="footer">Bu teklif ${companyName} tarafÄ±ndan oluÅŸturulmuÅŸtur.</div>
          </div>
        </div>
      </body>
      </html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
  };

  const openDeliveryPdf = (delivery) => {
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
        <title>Teslim TutanaÄŸÄ± - ${escapeHtml(delivery.teslimNo)}</title>
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
          .title { font-size: 30px; margin: 20px 0; letter-spacing: 1px; }
          .row { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 14px; }
          .row label { color: #8fa791; font-size: 12px; text-transform: uppercase; letter-spacing: .4px; display: block; margin-bottom: 6px; }
          .row span { color: #f8fff3; font-size: 16px; font-weight: 700; }
          .section { margin-bottom: 18px; }
          .section h3 { color: #a7f3d0; margin-bottom: 10px; }
          .signatures { display:flex; gap:24px; flex-wrap:wrap; margin-top:28px; }
          .signBox { flex:1; min-width:220px; border-top:1px solid #315235; padding-top:18px; color:#9ca98f; }
          .printBar { display: flex; justify-content: flex-end; margin-bottom: 20px; }
          .printBtn { background: #22c55e; color: #04120a; border: none; border-radius: 12px; padding: 12px 18px; font-size: 14px; cursor: pointer; }
          @media print { .printBar { display: none; } body { background: #fff; color: #000; } .card { border-color: #d1d5db; background: #fff; } .companyName { color: #000; } }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="printBar">
            <button class="printBtn" onclick="window.print();">YazdÄ±r / PDF Ä°ndir</button>
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
            <div class="title">TESLÄ°M TUTANAÄI</div>
            <div class="section">
              <div class="row"><div><label>Teslim No</label><span>${escapeHtml(delivery.teslimNo)}</span></div><div><label>Teslim Tarihi</label><span>${escapeHtml(delivery.teslimTarihi)}</span></div></div>
              <div class="row"><div><label>MÃ¼ÅŸteri / Ã‡iftÃ§i</label><span>${escapeHtml(delivery.musteri)}</span></div><div><label>Telefon</label><span>${escapeHtml(delivery.telefon)}</span></div></div>
            </div>
            <div class="section">
              <h3>ÃœrÃ¼n Bilgileri</h3>
              <div class="row"><div><label>ÃœrÃ¼n</label><span>${escapeHtml(delivery.urun)}</span></div><div><label>Tip</label><span>${escapeHtml(delivery.urunTipi)}</span></div></div>
              <div class="row"><div><label>Miktar</label><span>${escapeHtml(delivery.miktar)} ${escapeHtml(delivery.birim)}</span></div><div><label>Lot / Parti</label><span>${escapeHtml(delivery.lot)} / ${escapeHtml(delivery.parti)}</span></div></div>
              <div class="row"><div><label>SKT</label><span>${escapeHtml(delivery.skt)}</span></div><div><label>Tarla</label><span>${escapeHtml(delivery.tarla)}</span></div></div>
              <div class="row"><div style="flex:1"><label>KullanÄ±m AmacÄ±</label><span>${escapeHtml(delivery.kullanimAmaci)}</span></div></div>
            </div>
            <div class="section"><div class="row"><div style="flex:1"><label>Notlar</label><span>${escapeHtml(delivery.aciklama)}</span></div></div></div>
            <div class="signatures">
              <div class="signBox"><strong>Teslim Eden</strong><div>${escapeHtml(delivery.teslimEden)}</div><div>Ad Soyad / Ä°mza</div></div>
              <div class="signBox"><strong>Teslim Alan</strong><div>${escapeHtml(delivery.teslimAlan)}</div><div>Ad Soyad / Ä°mza</div></div>
            </div>
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
      if (modal.type === "Teslim Et") {
        const delivery = { ...modal.values, id: Date.now() };
        const updated = { ...prev, deliveries: [delivery, ...(prev.deliveries || [])] };
        if (modal.meta?.sourceModule && modal.meta?.sourceId) {
          updated[modal.meta.sourceModule] = (prev[modal.meta.sourceModule] || []).map((x) =>
            x.id === modal.meta.sourceId ? { ...x, durum: "Teslim Edildi" } : x
          );
        }
        return updated;
      }

      const list = prev[modal.module] || [];
      if (modal.type === "Yeni KayÄ±t") {
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

    if (lower.includes("stok")) answer += "Kritik stokta Fungisit X200 ve DAP GÃ¼bre gÃ¶rÃ¼nÃ¼yor. En kÄ±sa sÃ¼rede tedarik Ã¶nerilir.";
    else if (lower.includes("borÃ§") || lower.includes("borc")) answer += `Cari hesap analizi: Toplam borÃ§ â‚º${data.accounts.reduce((s,a)=>s+Number(String(a.borc).replace(/[^0-9]/g,'')),0).toLocaleString('tr-TR')}, en yÃ¼ksek borÃ§lu: ${data.accounts.reduce((a,b)=>{ const nb = Number(String(b.borc).replace(/[^0-9]/g,'')); return nb> (a.val||0)? {id:b.id,name:b.musteri,val:nb}:a},{}) .name || 'â€”' }.`;
    else if (lower.includes("mÃ¼ÅŸteri") || lower.includes("risk")) answer += "Marmara SeracÄ±lÄ±k Ã¶deme gecikmesi nedeniyle riskli mÃ¼ÅŸteri olarak iÅŸaretlendi.";
    else if (lower.includes("tarla") || lower.includes("ilaÃ§")) answer += "Zeynep Arslan Domates SerasÄ± iÃ§in mantar kontrolÃ¼ gecikmiÅŸ gÃ¶rÃ¼nÃ¼yor.";
    else if (lower.includes("satÄ±ÅŸ")) answer += "Bu ay en gÃ¼Ã§lÃ¼ satÄ±ÅŸ fÄ±rsatÄ± Ege TarÄ±m A.Å. ve GÃ¼neydoÄŸu TarÄ±m Grubu tarafÄ±nda.";
    else answer += "SatÄ±ÅŸ, stok, cari hesap ve tarla uygulamalarÄ±nda takip edilebilir bir iÅŸlem gÃ¶rÃ¼nÃ¼yor.";

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
          <div className="stat"><span>Toplam SatÄ±ÅŸ (6 ay)</span><b>{formatMoney(totalSales)}</b></div>
          <div className="stat"><span>En YÃ¼ksek Ay</span><b>{highestMonth()}</b></div>
          <div className="stat"><span>Ortalama SatÄ±ÅŸ</span><b>{formatMoney(Math.round(totalSales / salesData.length))}</b></div>
          <div className="stat"><span>Kritik Stok</span><b>{alerts.length}</b></div>
        </section>

        <section className="dashGrid">
          <div className="panel chartPanel">
            <h3>AylÄ±k SatÄ±ÅŸ GrafiÄŸi</h3>
            <div className="donutSection">
              <div className="donutChart" style={{ background: `conic-gradient(${donutGradient})` }}>
                <div className="donutCenter">
                  <strong>{formatMoney(totalSales)}</strong>
                  <span>Toplam SatÄ±ÅŸ</span>
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
            <h3>Kritik UyarÄ±lar</h3>
            {alerts.map((a) => (
              <div key={a.id} className="warning" onClick={() => openModal("UyarÄ± DetayÄ±", "alerts", a)}>
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
        <div className="panelHead"><h3>Son SipariÅŸler</h3></div>
        {renderTable("orders", data.orders, false)}
      </section>
    </>
  );
  };

  function formatMoney(v) { return `â‚º${v.toLocaleString('tr-TR')}`; }
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
              <p>{f.tarla} â†’ {f.sonUrun}</p>
              <b>Sonraki Ä°ÅŸlem</b>
              <p>{f.sonraki}</p>
            </div>
            <div className="actions">
              <button onClick={() => openModal("Detay", "farmerCards", f)}><Eye size={14} /></button>
              <button onClick={() => openModal("DÃ¼zenle", "farmerCards", f)}><Pencil size={14} /></button>
              <button onClick={() => deleteFarmerRecord(f)}><Trash2 size={14} /></button>
              <button className="whatsappBtn" onClick={() => sendWhatsApp(f)}><WhatsAppIcon size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const calendarPage = () => (
    <div>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        {["BugÃ¼n", "Bu Hafta", "Geciken"].map((t) => (
          <button key={t} className={calendarTab===t? 'primary' : ''} onClick={() => setCalendarTab(t)}>{t}</button>
        ))}
        <button style={{marginLeft:'auto'}} onClick={() => openModal('Yeni KayÄ±t','calendar')}>Yeni Ä°ÅŸlem Ekle</button>
      </div>
      <div className="calendarGrid">
        {(data.calendar.filter((r) => (calendarTab==='TÃ¼mÃ¼' ? true : r.zaman === calendarTab))).map((r) => (
          <div className="panel taskCard" key={r.id}>
            <h4>{r.islem}</h4>
            <p>{r.ciftci} / {r.tarla}</p>
            <p className={`status ${r.zaman==='Geciken' || r.durum==='Acil' ? 'danger' : ''}`}>{r.durum}</p>
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <button onClick={() => openModal('Detay','calendar',r)}>Detay</button>
              <button onClick={() => {
                setData((prev)=>({ ...prev, calendar: prev.calendar.map(x=> x.id===r.id?{...x,durum:'TamamlandÄ±'}:x) }));
              }}>TamamlandÄ±</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const barcodePage = () => (
    <>
      <section className="barcodeTools">
        <button className="primary" onClick={() => openModal("Yeni KayÄ±t", "barcode")}><Plus size={15} /> Barkod OluÅŸtur</button>
        <button onClick={() => alert("Demo: QR kod Ã¶nizleme hazÄ±rlandÄ±.")}><QrCode size={15} /> QR Kod</button>
        <button onClick={() => alert("Demo: YazdÄ±rma ekranÄ± aÃ§Ä±ldÄ±.")}><Printer size={15} /> YazdÄ±r</button>
        <button onClick={() => alert("Demo: Stok giriÅŸ/Ã§Ä±kÄ±ÅŸ iÅŸlemi baÅŸlatÄ±ldÄ±.")}><ArrowDownUp size={15} /> Stok Hareketi</button>
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
              <button onClick={() => openModal("DÃ¼zenle", "barcode", b)}><Pencil size={14} /></button>
              <button onClick={() => alert("Demo: Barkod yazdÄ±rÄ±lÄ±yor.")}><Printer size={14} /></button>
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
          Firma AdÄ±
          <input value={company.name} onChange={(e) => setCompany((prev) => ({ ...prev, name: e.target.value }))} placeholder="Firma adÄ±" />
        </label>
        <label>
          Logo URL
          <input value={company.logo} onChange={(e) => setCompany((prev) => ({ ...prev, logo: e.target.value }))} placeholder="https://..." />
        </label>
        <label>
          Logo YÃ¼kleme
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
          <h4>Logo Ã–nizleme</h4>
          <img src={company.logo} alt="Logo Ã–nizleme" />
        </div>
      )}
    </section>
  );

  const aiPage = () => (
    <section className="panel aiPanel">
      <h3>AkÄ±llÄ± TarÄ±m AsistanÄ±</h3>
      <div className="chatBox">
        {chat.map((m, i) => <div key={i} className={`msg ${m.from}`}>{m.text}</div>)}
      </div>
      <div className="aiSend">
        <input
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendAI()}
          placeholder="Ã–rn: Kritik stoklarÄ± gÃ¶ster..."
        />
        <button className="primary" onClick={sendAI}><Send size={15} /> GÃ¶nder</button>
      </div>
    </section>
  );

  function renderTable(module, customRows = filteredRows, includePanel = true) {
    const keys = schemaFor(module);
    const showRows = customRows.filter((r) => {
      if (tableFilter === "TÃ¼mÃ¼") return true;
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
            <th>Ä°ÅŸlemler</th>
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
                <button onClick={() => openModal("DÃ¼zenle", module, row)}><Pencil size={14} /></button>
                <button className="whatsappBtn" onClick={() => sendWhatsApp(row)}><WhatsAppIcon size={18} /></button>
              {(module === "offers" || module === "deliveries") && (
                <button className="pdfButton" onClick={() => (module === "offers" ? openOfferPdf(row) : openDeliveryPdf(row))}><Printer size={14} /> PDF</button>
              )}
              {(module === "orders" || module === "offers") && row.durum !== "Teslim Edildi" && (
                <button className="primary" onClick={() => openModal("Teslim Et", "deliveries", null, {
                  teslimNo: `TES-${Date.now()}`,
                  musteri: row.musteri || row.ciftci || "",
                  telefon: row.telefon || "",
                  teslimTarihi: new Date().toLocaleDateString('tr-TR'),
                  teslimEden: "",
                  teslimAlan: "",
                  urun: row.urun || "",
                  urunTipi: row.kategori || "",
                  miktar: row.miktar || "",
                  birim: row.birim || "",
                  lot: row.lot || "",
                  parti: row.parti || "",
                  skt: row.skt || "",
                  tarla: row.tarla || "",
                  dekar: row.dekar || "",
                  kullanimAmaci: "",
                  aciklama: "",
                  teslimDurumu: "Teslim Edildi",
                }, { sourceModule: module, sourceId: row.id })}>
                  Teslim Et
                </button>
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
            {['TÃ¼mÃ¼','Aktif','Bekliyor','Kritik'].map((t)=> (
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

  const currentTitle = page === "dashboard" ? "GÃ¶sterge Paneli" : pageInfo[page]?.[0] || "Teklifler";
  const currentDesc = page === "dashboard" ? "Sisteme genel bakÄ±ÅŸ ve temel metrikler." : pageInfo[page]?.[1] || "KayÄ±tlarÄ± yÃ¶netin.";

  return (
    <div className="app">
      <aside>
        <div className="logo">ğŸŒ± <span>AgroPilot</span></div>
        {menuGroups.map((group) => (
          <div className="group" key={group.title}>
            <small>{group.title}</small>
            {group.items.map(([id, title, Icon]) => (
              <button key={id} onClick={() => { setPage(id); setSearch(""); setTableFilter('TÃ¼mÃ¼'); setMobileMenuOpen(false); }} className={page === id ? "active" : ""}>
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
            <button className="primary" onClick={() => openModal("Yeni KayÄ±t", page)}>
              <Plus size={15} /> Yeni Ekle
            </button>
          )}
        </header>

        {page !== "dashboard" && page !== "ai" && page !== "companySettings" && (
          <section className="stats">
            <div className="stat"><span>Toplam KayÄ±t</span><b>{rows.length}</b></div>
            <div className="stat"><span>Aktif Ä°ÅŸlem</span><b>{Math.max(1, rows.length - 1)}</b></div>
            <div className="stat"><span>GÃ¼ncel Durum</span><b>Takipte</b></div>
          </section>
        )}

        {content()}
      </main>

      {modal && (
        <div className="modal">
          <div className="modalBox">
            <button className="close" onClick={() => setModal(null)}><X size={16} /></button>
            <h2>{modal.type}</h2>
            <p className="modalDesc">{pageInfo[modal.module]?.[0] || "KayÄ±t"} iÅŸlem paneli</p>

            {modal.type === "Sil" ? (
              <div className="deleteBox">
                <AlertTriangle size={32} />
                <p>Bu kaydÄ± silmek istediÄŸine emin misin?</p>
              </div>
            ) : modal.module === 'alerts' && modal.type === 'UyarÄ± DetayÄ±' ? (
              <div style={{padding:12}}>
                <h3>{modal.record.type}</h3>
                <p>{modal.record.text}</p>
                <div style={{display:'flex',gap:8,marginTop:12}}>
                  <button className="primary" onClick={() => {
                    setAlerts((prev) => prev.filter(a => a.id !== modal.record.id));
                    setModal(null);
                  }}>Ã‡Ã¶zÃ¼ldÃ¼</button>
                  <button onClick={() => { openModal('Detay', modal.record.related.module, data[modal.record.related.module].find(x=>x.id===modal.record.related.id)); }}>Ä°lgili KayÄ±t</button>
                </div>
              </div>
            ) : (
              schemaFor(modal.module).map((field) => (
                <label key={field}>
                  {label(field)}
                  {(() => {
                    const options = selectOptions(field, modal.module);
                    if (options) {
                      return (
                        <select
                          disabled={modal.type === "Detay"}
                          value={modal.values[field] || ""}
                          onChange={(e) => setModal({ ...modal, values: { ...modal.values, [field]: e.target.value } })}
                        >
                          {options.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      );
                    }
                    return (
                      <input
                        disabled={modal.type === "Detay"}
                        value={modal.values[field] || ""}
                        onChange={(e) => setModal({ ...modal, values: { ...modal.values, [field]: e.target.value } })}
                      />
                    );
                  })()}
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
    firma: "Firma", sehir: "Åehir", telefon: "Telefon", ciro: "Ciro", durum: "Durum",
    bayi: "Bayi", bolge: "BÃ¶lge", yetkili: "Yetkili", satis: "SatÄ±ÅŸ",
    urun: "ÃœrÃ¼n", kategori: "Kategori", lot: "Lot No", parti: "Parti No", skt: "SKT", stok: "Stok",
    depo: "Depo", giris: "GiriÅŸ", cikis: "Ã‡Ä±kÄ±ÅŸ", kalan: "Kalan",
    no: "No", musteri: "MÃ¼ÅŸteri", tutar: "Tutar", tarih: "Tarih",
    borc: "BorÃ§", alacak: "Alacak", bakiye: "Bakiye",
    tahsilatNo: "Tahsilat No", yontem: "YÃ¶ntem",
    hesap: "Hesap", tip: "Tip", hareket: "Hareket",
    teklifNo: "Teklif No", gecerlilik: "GeÃ§erlilik",
    ciftci: "Ã‡iftÃ§i", tarla: "Tarla", toplamTarla: "Tarla SayÄ±sÄ±", dekar: "Dekar", sonUrun: "Son ÃœrÃ¼n", sonraki: "Sonraki Ä°ÅŸlem",
    doz: "Doz", uygulama: "Uygulama", zaman: "Zaman", islem: "Ä°ÅŸlem", barkod: "Barkod No",
    teslimNo: "Teslim No", telefon: "Telefon", teslimTarihi: "Teslim Tarihi", teslimEden: "Teslim Eden Personel", teslimAlan: "Teslim Alan KiÅŸi", urunTipi: "ÃœrÃ¼n Tipi", miktar: "Miktar", birim: "Birim", parti: "Parti No", kullanimAmaci: "KullanÄ±m AmacÄ±", aciklama: "AÃ§Ä±klama / Not", teslimDurumu: "Teslim Durumu",
    cekNo: "Ã‡ek No", banka: "Banka", sube: "Åube", vadeTarihi: "Vade Tarihi", borclu: "BorÃ§lu", alacakli: "AlacaklÄ±",
  };
  return map[key] || key;
}

function moneyCell(key) {
  return ["tutar", "ciro", "borc", "alacak", "bakiye", "satis"].includes(key);
}

function statusCell(key) {
  return ["durum", "teslimDurumu"].includes(key);
}

function selectOptions(field, module) {
  if (field === "durum" && (module === "orders" || module === "offers")) {
    return ["HazÄ±rlanÄ±yor", "Teslim Edildi", "Bekliyor", "Gecikti", "Ä°ptal"];
  }
  if (field === "durum") {
    return ["Aktif", "Bekliyor", "PlanlandÄ±", "UygulandÄ±", "Kritik", "Takipte", "TamamlandÄ±"];
  }
  if (field === "teslimDurumu") {
    return ["Teslim Edildi", "Bekliyor", "Gecikti", "Ä°ade"];
  }
  return null;
}

export default App;

