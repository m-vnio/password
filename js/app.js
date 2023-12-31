import setting from "./setting.js"
export default ()=>{

    const form = document.querySelector('.form_wD534')
    const texto_limite = document.querySelector('.span_LyD6i')
    const line_limite  = document.querySelector('.div_aHEds hr')
    const container_notification = document.querySelector('.div_52rpa')
    const container_guardado = document.querySelector('.div_UiyeJ')
    const lista_guardado = container_guardado.querySelector('.div_kMLwr') 
    const input_copy = document.getElementById('input_copy')

    const data  = {}
    data.mayuscula = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    data.minuscula = data.mayuscula.toLowerCase()
    data.numero    = '0123456789'
    data.simbolo   = '({[¿¡@/_-Ññ!?]})'

    const input_checkbox = {
        mayuscula : form.querySelector("input[data-type=mayuscula]"),
        minuscula: form.querySelector("input[data-type=minuscula]"),
        numero : form.querySelector("input[data-type=numero]"),
        simbolo: form.querySelector("input[data-type=simbolo]")
    }

    const random_number = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    }
 
    const renderPassword =()=> {
        const limit     = parseInt(form.limite.max)
        const lenght    = parseInt(form.limite.value)
        const checkbox  = form.querySelectorAll("input[type='checkbox']:checked")

        if(checkbox.length != 0){
            const password  = [ ...Array(lenght) ].map(()=> {
                const type  = checkbox[random_number(0, checkbox.length)].dataset.type
                return data[type][random_number(0, data[type].length)] 
            }).join('')

            form.password.value = password 
        } else { 
            form.password.value = Date.now() 
        }
        
        texto_limite.textContent    = lenght
        line_limite.style.width     = (100 * lenght) / limit + '%'

        upload_setting()
    }

    const render_setting =()=>{
        const setting = JSON.parse(localStorage.getItem('setting'))
        form.limite.value = setting.limit
        
        input_checkbox.mayuscula.checked    = setting.checkbox.mayuscula 
        input_checkbox.minuscula.checked    = setting.checkbox.minuscula 
        input_checkbox.numero.checked       = setting.checkbox.numero 
        input_checkbox.simbolo.checked      = setting.checkbox.simbolo 
    }

    const upload_setting =()=>{
        const setting = JSON.parse(localStorage.getItem('setting'))

        setting.limit = parseInt(form.limite.value)
        setting.checkbox = {
            mayuscula   : input_checkbox.mayuscula.checked,
            minuscula   : input_checkbox.minuscula.checked,
            numero      : input_checkbox.numero.checked,
            simbolo     : input_checkbox.simbolo.checked
        }
        
        localStorage.setItem('setting', JSON.stringify(setting))
    }

    const upload_guardar=()=>{
        const guardado = JSON.parse(localStorage.getItem('guardado')) ?? []
        const index = guardado.findIndex(data => data.id == form.password.value)

        if(index != -1) guardado.splice(index, 1)

        guardado.push({
            id : form.password.value, 
            descripcion : form.descripcion.value
        }) 

        localStorage.setItem('guardado', JSON.stringify(guardado))
    }

    const render_lista_guardado =()=>{
        const guardado = (JSON.parse(localStorage.getItem('guardado'))).reverse()

        if(guardado.length === 0 ){ 
            return lista_guardado.innerHTML = `
                <div class="div_Y8Qrq">
                    <h4>lista vacia</h4>
                </div>
            `
        }

        lista_guardado.innerHTML = guardado.map(data => {
            return `
                <div class="div_Y8Qrq" data-id="${ data.id }">
                    <div class="div_0YvDV">
                        <h4>${ data.id }</h4>
                        <p>${ data.descripcion }</p>
                    </div>
                    <div class="div_4GbWt">
                        <button data-action="delete"><i class="fa-solid fa-ban"></i></button>
                        <button data-action="update"><i class="fa-solid fa-pen"></i></button>
                        <button data-action="copy"><i class="fa-regular fa-copy"></i></button>
                    </div>
                </div>
            `
        }).join('')
    }

    const addNotificacion =(data = {})=>{
        let notification = document.createElement('div')
        notification.innerHTML = `
            <div class="div_WqAlT" style="background : ${ data.color ?? '#82C9AC' }">
                <p>${ data.message }</p>
                <button><i class="fa-solid fa-xmark"></i></button>
            </div> 
        `
        notification = notification.children[0]
        container_notification.append(notification)

        const remove_notification =()=>{
            notification.classList.add('end')
            setTimeout(()=> notification.remove(), 1500)
        }

        notification.querySelector('button').addEventListener('click', remove_notification)
        setTimeout(remove_notification, (data.time ?? 3000))
    }

    form.addEventListener('input', e => e.target.type !== 'text' && renderPassword())
    container_guardado.children[0].addEventListener('click', ()=> container_guardado.style.display = 'none')
    document.querySelector('button[data-action=lista_guardado]').addEventListener('click', ()=> {
        container_guardado.style.display = 'grid'
        render_lista_guardado()
    })

    lista_guardado.addEventListener('click', e => {
        const trg = e.target.closest('button')

        if(trg){
            const item = trg.closest('.div_Y8Qrq')
            const id     = item.dataset.id
            const action = trg.dataset.action

            const guardado = (JSON.parse(localStorage.getItem('guardado'))).reverse()
            const index = guardado.findIndex(data => data.id == id)

            if(action == 'copy'){
                input_copy.value = id
                input_copy.select(), document.execCommand('copy')
                setTimeout(()=> getSelection().removeAllRanges())
                addNotificacion({
                    color   : '#AEC8E8',
                    message : 'copiado',
                    time    : 1500
                })
            }

            else if(action == 'delete'){
                if(index != -1) {
                    guardado.splice(index, 1)
                    localStorage.setItem('guardado', JSON.stringify(guardado))
                    render_lista_guardado()

                    addNotificacion({
                        color   : '#E79B9B',
                        message : 'eliminado',
                        time    : 1500
                    })
                } 
            } else if (action == 'update'){
                form.password.value = guardado[index].id
                form.descripcion.value = guardado[index].descripcion
                container_guardado.style.display = 'none'
            }
        }

    }) 

    document.querySelector('button[data-action=change]').addEventListener('click', renderPassword)
    document.querySelector('button[data-action=guardar]').addEventListener('click', ()=> {
        upload_guardar()
        addNotificacion({
            color   : '#F7D08A',
            message : 'guardado',
            time    : 2000
        })
    })
    document.querySelector('button[data-action=copy]').addEventListener('click', ()=> {
        form.password.select(), document.execCommand('copy')
        setTimeout(()=> getSelection().removeAllRanges()) 
        addNotificacion({
            color   : '#AEC8E8',
            message : 'copiado',
            time    : 1500
        })
    })
    
    setting()
    render_setting()
    renderPassword()
    //div_ChjEG
}
