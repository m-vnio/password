export default ()=>{
    if(!localStorage.getItem('setting')){
        localStorage.setItem('setting', JSON.stringify({
            limit : 10,
            checkbox : {
                mayuscula : true,
                minuscula: true,
                numero : true,
                simbolo: false
            }
        }))
    }

    if(!localStorage.getItem('guardado')){
        localStorage.setItem('guardado', '[]')
    }
}