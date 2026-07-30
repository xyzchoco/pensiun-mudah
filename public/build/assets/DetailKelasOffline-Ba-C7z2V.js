import{c as e,d as t,n,r,t as i}from"./app-DsOnmn3v.js";import{t as a}from"./DashboardLayout-4or2AENz.js";var o=t(e(),1),s=i();function c({course:e={},downloadHref:t=null}){let{title:i=`Kelas Offline`,instruktur:c=`Akan dikonfirmasi`,perusahaan:d=`Akan dikonfirmasi`,tanggal:f=`Akan dikonfirmasi`,jadwal:p=`Akan dikonfirmasi`,tempat:m=`Akan dikonfirmasi`,durasi:h=`Akan dikonfirmasi`}=e;return(0,o.useEffect)(()=>{let e=document.createElement(`style`);return e.innerHTML=`
            @media print {
                /* Hide sidebar */
                [data-testid="sidebar"],
                nav,
                aside,
                .sidebar {
                    display: none !important;
                }
                
                /* Hide navigation elements */
                header {
                    display: none !important;
                }
                
                /* Adjust main content to full width */
                body,
                main,
                .container {
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                /* Hide buttons except print-visible ones */
                button[onclick*="print"],
                .print-button {
                    display: block !important;
                }
                
                /* Clean up margins and padding for print */
                .mx-auto,
                .px-4,
                .py-10 {
                    margin: 0 !important;
                    padding: 0 !important;
                }
            }
        `,document.head.appendChild(e),()=>{document.head.removeChild(e)}},[]),(0,s.jsxs)(a,{title:`Bukti Pendaftaran`,showSearch:!1,children:[(0,s.jsx)(n,{title:`Bukti Pendaftaran - ${i}`}),(0,s.jsxs)(`div`,{className:`mx-auto max-w-3xl px-4 py-10`,children:[(0,s.jsxs)(`div`,{className:`flex flex-col items-center text-center`,children:[(0,s.jsx)(`span`,{className:`flex h-24 w-24 items-center justify-center rounded-full bg-[#006B32] shadow-[0px_10px_15px_-3px_rgba(0,107,50,0.2)]`,children:(0,s.jsx)(`svg`,{className:`h-10 w-10 text-white`,fill:`none`,stroke:`currentColor`,strokeWidth:`3`,viewBox:`0 0 24 24`,children:(0,s.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M5 13l4 4L19 7`})})}),(0,s.jsx)(`h1`,{className:`mt-6 text-3xl font-bold tracking-tight text-[#1B1C1C] sm:text-4xl`,children:`Selamat! Anda Berhasil Bergabung`})]}),(0,s.jsxs)(`div`,{className:`mt-8 flex items-start gap-4 rounded-xl border-2 border-[#964900] bg-[#F6F3F2] p-4`,children:[(0,s.jsxs)(`svg`,{className:`h-6 w-6 shrink-0 text-[#964900]`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,viewBox:`0 0 24 24`,children:[(0,s.jsx)(`circle`,{cx:`12`,cy:`12`,r:`9`}),(0,s.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M12 8h.01M11 12h1v4h1`})]}),(0,s.jsx)(`p`,{className:`text-sm text-[#1B1C1C]`,children:`Wajib diunduh atau tangkapan layar (screenshot) sebagai bukti saat menghadiri kelas offline.`})]}),(0,s.jsxs)(`div`,{className:`relative mt-6 overflow-hidden rounded-2xl border border-[#BCCABB] bg-white shadow-sm`,children:[(0,s.jsxs)(`div`,{className:`p-8`,children:[(0,s.jsxs)(`div`,{className:`flex items-center justify-between gap-4`,children:[(0,s.jsx)(`span`,{className:`text-base text-[#006B32]`,children:`Bukti Pendaftaran`}),(0,s.jsx)(`span`,{className:`text-sm font-extrabold text-[#006B32] opacity-60`,children:`PENSIUN MUDAH`})]}),(0,s.jsxs)(`div`,{className:`mt-8 grid gap-8 sm:grid-cols-2`,children:[(0,s.jsxs)(`div`,{className:`space-y-4`,children:[(0,s.jsx)(l,{label:`Judul Pelatihan`,value:i}),(0,s.jsx)(l,{label:`Pemateri`,value:c}),(0,s.jsx)(l,{label:`Nama Perusahaan`,value:d})]}),(0,s.jsxs)(`div`,{className:`space-y-4`,children:[(0,s.jsx)(u,{icon:`📅`,label:`Tanggal Pelaksanaan`,value:f}),(0,s.jsx)(u,{icon:`🕐`,label:`Jam Pelaksanaan`,value:p}),(0,s.jsx)(u,{icon:`📍`,label:`Lokasi`,value:m}),(0,s.jsx)(u,{icon:`⏱️`,label:`Durasi`,value:h+` Hari`})]})]}),(0,s.jsx)(`div`,{className:`mt-8 border-t-2 border-dashed border-[#BCCABB]`})]}),(0,s.jsx)(`span`,{className:`absolute -left-4 bottom-[92px] h-8 w-8 rounded-full border border-[#BCCABB] bg-[#FBF9F8]`}),(0,s.jsx)(`span`,{className:`absolute -right-4 bottom-[92px] h-8 w-8 rounded-full border border-[#BCCABB] bg-[#FBF9F8]`})]}),(0,s.jsxs)(`div`,{className:`mx-auto mt-8 flex max-w-md flex-col gap-4`,children:[(0,s.jsxs)(`button`,{type:`button`,onClick:()=>{t?window.location.href=t:(document.body.classList.add(`print-mode`),window.print(),setTimeout(()=>{document.body.classList.remove(`print-mode`)},500))},className:`flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF8928] py-3.5 font-bold text-[#642F00] shadow-sm transition-colors hover:bg-[#F57F1E]`,children:[(0,s.jsx)(`svg`,{className:`h-5 w-5`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,viewBox:`0 0 24 24`,children:(0,s.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l-4-4m4 4l4-4`})}),`Unduh Bukti Pendaftaran (PDF)`]}),(0,s.jsxs)(r,{href:route(`dashboard`),className:`flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#006B32] py-3.5 font-bold text-[#006B32] transition-colors hover:bg-[#006B32]/5`,children:[(0,s.jsx)(`svg`,{className:`h-5 w-5`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,viewBox:`0 0 24 24`,children:(0,s.jsx)(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M3 12l9-9 9 9M5 10v10h14V10`})}),`Kembali ke Dashboard`]})]})]})]})}function l({label:e,value:t}){return(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{className:`text-xs font-semibold uppercase tracking-wide text-[#3D4A3E]`,children:e}),(0,s.jsx)(`p`,{className:`mt-1 text-[#1B1C1C]`,children:t})]})}function u({icon:e,label:t,value:n}){return(0,s.jsxs)(`div`,{className:`flex items-start gap-3`,children:[(0,s.jsx)(`span`,{className:`text-lg leading-none text-[#006B32]`,children:e}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`p`,{className:`text-xs font-semibold uppercase tracking-wide text-[#3D4A3E]`,children:t}),(0,s.jsx)(`p`,{className:`mt-1 text-[#1B1C1C]`,children:n})]})]})}export{c as default};