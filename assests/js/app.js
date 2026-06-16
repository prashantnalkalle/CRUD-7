const cl = console.log;
const inputform = document.getElementById('inputform')
const title = document.getElementById('title')
const body = document.getElementById('body')
const userId = document.getElementById('userId')
const Addpost = document.getElementById('Addpost')
const Updatepost = document.getElementById('Updatepost')
const CardContainer = document.getElementById('CardContainer')
const spinner = document.getElementById('spinner')



let postArr =[]

let Base_Url = `https://jsonplaceholder.typicode.com/posts`


function snackbar(msg,icon){
    swal.fire({
        title : msg,
        icon : icon,
        timer : 2000
    })
}


function fetchposts(){
    spinner.classList.remove('d-none')
    
    let xhr = new XMLHttpRequest()

    xhr.open('GET',Base_Url)

    xhr.send(null)

    xhr.onload = function (){
        if(xhr.status >= 200 && xhr.status <=299){
            postArr = JSON.parse(xhr.response)


            CreatePostCards(postArr.reverse())
            $(function () {
                $('[data-toggle="tooltip"]').tooltip()
            })

        }


        spinner.classList.add('d-none')

    }

    

}

fetchposts()


function CreatePostCards(arr){
    let result =''

    arr.forEach(ele => {
        result +=`<div class="col-md-6 my-4" id='${ele.id}'>
					<div class="card h-100 ">
						<div class="card-header bg-primary text-white" data-toggle="tooltip" data-placement="top" title="${ele.title}">
							<h2>${ele.title}</h2>
						</div>
						<div class="card-body  ">
							<p>${ele.body}</p>
						</div>
						<div class="card-footer bg-light d-flex justify-content-between">
							<button class="btn btn-success btn-sm" onclick="Onedit(this)">Edit</button>
							<button type="button" class="btn btn-danger btn-sm" onclick="Onremove(this)">Remove</button>
						</div>
					</div>
				</div>`
    });
    CardContainer.innerHTML = result


}

function onsubmit(ele){
    spinner.classList.remove('d-none')

    ele.preventDefault()

    let newPost = {
        title : title.value,
        body : body.value,
        userId : userId.value
    }

    let xhr = new XMLHttpRequest()

    xhr.open('POST',Base_Url)

    xhr.send(JSON.stringify(newPost))

    xhr.onload = function(){
        if(xhr.status >=200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response)

            CreateNewPost(newPost,res)
            $(function () {
             $('[data-toggle="tooltip"]').tooltip()
            })
        }
        spinner.classList.add('d-none')
    }
}



function CreateNewPost(newPost,res){
    let div = document.createElement('div')
    div.className = 'col-md-6 my-4 '
    div.id = res.id

    div.innerHTML =`<div class="card h-100">
						<div class="card-header bg-primary text-white" data-toggle="tooltip" data-placement="top" title="${newPost.title}">
							<h2>${newPost.title}</h2>
						</div>
						<div class="card-body">
							<p>${newPost.body}</p>
						</div>
						<div class="card-footer bg-light d-flex justify-content-between">
							<button class="btn btn-success btn-sm" onclick="Onedit(this)">Edit</button>
							<button type="button" class="btn btn-danger btn-sm" onclick="Onremove(this)">Remove</button>
						</div>
					</div>`

    CardContainer.prepend(div)
    inputform.reset()

    snackbar(`The new Post Id ${res.id} is Added Successfully !!` , 'success')
}



function Onedit(ele){

    spinner.classList.remove('d-none')

    let editId = ele.closest('.col-md-6').id


    localStorage.setItem('EditId',editId)

    let Edit_Url = `${Base_Url}/${editId}`

    let xhr = new XMLHttpRequest()
    xhr.open('GET',Edit_Url)

    xhr.send(null)

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let editObj = JSON.parse(xhr.response)

            title.value = editObj.title
            body.value = editObj.body
            userId.value = editObj.userId


            Addpost.classList.add('d-none')
            Updatepost.classList.remove('d-none')
            inputform.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
            });
        }
        spinner.classList.add('d-none')

    }


}

function onupdate(){
    spinner.classList.remove('d-none')

    let updateId = localStorage.getItem('EditId')

    let updateObj ={
        title : title.value,
        body : body.value,
        userId : userId.value,
        id : updateId
    }

    let update_url = `${Base_Url}/${updateId}`

    let xhr = new XMLHttpRequest()

    xhr.open('PUT',update_url)

    xhr.send(updateObj)


    xhr.onload = function (){
        if(xhr.status >= 200 && xhr.status <= 299){

            let div = document.getElementById(updateId)

            let h2 = div.querySelector('.card-header h2')
            h2.innerText = updateObj.title

            let p = div.querySelector('.card-body p')

            p.innerText = updateObj.body

            Addpost.classList.remove('d-none')
            Updatepost.classList.add('d-none')

            inputform.reset()

            snackbar(`The  Post Id ${updateId} is Updated Successfully !!` , 'success')

            div.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            div.classList.add('highlight');

            setTimeout(() => {
                div.classList.remove('highlight');
            }, 4000);

        }
        spinner.classList.add('d-none')
    }
}

function Onremove(ele){

    let removeId = ele.closest('.col-md-6').id

    Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            spinner.classList.remove('d-none')
                
            let removeUrl = `${Base_Url}/${removeId}`

            let xhr = new XMLHttpRequest()

            xhr.open('DELETE',removeUrl)

            xhr.send()

            xhr.onload = function (){
                if(xhr.status >= 200 && xhr.status <= 299){

                    ele.closest('.col-md-6').remove()
                    
                    snackbar(`The  Post Id ${removeId} is Removed Successfully !!` , 'success')


                }


                spinner.classList.add('d-none')

            }
        }
    });

}


inputform.addEventListener('submit',onsubmit)
Updatepost.addEventListener('click',onupdate)

