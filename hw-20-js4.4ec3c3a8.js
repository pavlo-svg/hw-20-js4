let t=document.querySelector("#search-form"),e=document.querySelector(".gallery"),a=document.querySelector(".load-more"),s=1,r="",i=0,l=0,o=!1;async function n(t=!1){if(!o){o=!0,a.disabled=!0;try{let o=await async function(t,e){try{let a=new URLSearchParams({key:"57813574-c8977c5d3dcf506f235105762",image_type:"photo",orientation:"horizontal",q:t,page:e,per_page:12}),s=await fetch(`https://pixabay.com/api/?${a}`);if(!s.ok)throw Error("Помилка HTTP-запиту");return await s.json()}catch(t){throw console.error("Помилка завантаження:",t),t}}(r,s);if(i=o.totalHits,0===o.hits.length){0===l&&alert("Зображень не знайдено!"),a.style.display="none";return}if(await async function(t,e){try{let a=t.map(({webformatURL:t,largeImageURL:e,tags:a,likes:s,views:r,comments:i,downloads:l})=>`
          <li class="photo-card">
            <a href="${e}" target="_blank">
              <img src="${t}" alt="${a}" loading="lazy" />
            </a>

            <div class="stats">
              <p class="stats-item">
                <i class="material-icons">thumb_up</i>
                ${s}
              </p>

              <p class="stats-item">
                <i class="material-icons">visibility</i>
                ${r}
              </p>

              <p class="stats-item">
                <i class="material-icons">comment</i>
                ${i}
              </p>

              <p class="stats-item">
                <i class="material-icons">cloud_download</i>
                ${l}
              </p>
            </div>
          </li>
        `).join("");e.insertAdjacentHTML("beforeend",a)}catch(t){throw console.error("Помилка відображення зображень:",t),t}}(o.hits,e),l+=o.hits.length,a.style.display=l<i?"block":"none",t){let t=e.querySelectorAll(".photo-card");t[t.length-o.hits.length].scrollIntoView({behavior:"smooth",block:"start"})}}catch(t){console.error(t),alert("Не вдалося завантажити зображення. Спробуй ще раз.")}finally{o=!1,a.disabled=!1}}}a.style.display="none",t.addEventListener("submit",async t=>{t.preventDefault(),(r=t.currentTarget.elements.query.value.trim())&&!o&&(s=1,l=0,e.innerHTML="",a.style.display="none",await n())}),a.addEventListener("click",async()=>{o||l>=i||(s++,await n(!0))});
//# sourceMappingURL=hw-20-js4.4ec3c3a8.js.map
