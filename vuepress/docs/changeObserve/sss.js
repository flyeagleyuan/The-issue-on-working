
//test subscribe publish

class Publish {
  constructor (name='publisher') {
    this.messageMap ={}
    this.name = name
    //随机ID
    this.id = 'id-'+ Date.now() + Math.ceil(Math.random()*10000)
  }

  addListener (subscriber, message){//添加订阅
    if(!subscriber|| !message) return

    if(!this.messageMap[message]){
      this.messageMap[message] = []
    }

    const exitIndex = this.messageMap[message].findIndex(exitSubscrber=> exitSubscrber.id === subscriber.id)
    if(exitIndex===-1){
      this.messageMap[message].push(subscriber)
    }else{
      this.messageMap[message][exitIndex][message+this.id+'_handler']=subscriber[message+this.id+'_handler']
    }
  }

  removeListen(subscriber,message){
    if(!subscriber) return false
    //如果传入了message则删除message下的订阅，没有则删除全部
    const messages= message?[message]:Object.keys(this.messageMap)
    messages.forEach(messageItem=>{
      const subscribers = this.messageMap[messageItem]
      if(!subscribers)return false

      let i = subscribers.length
      while(i--){
        if(subscribers[i].id===subscriber.id){
          subscribers.splice(i,1)
        }
      }
      if(!i) delete this.messageMap[messageItem]
    })
  }

  publish(message,info){
    const subscribers = this.messageMap[message]||[]

    subscribers.forEach(subscriber=> subscriber[message+this.id+'_handler'](info))
    return this
  }
}

class Subscribe{
  constructor (name='subscribe'){
    this.name= name
    this.id = 'id-'+ Date.now()+Math.ceil(Math.random()*10000)
  }

  listen({
    publisher,
    message,
    handler
  }){
    if(publisher instanceof Publish){
      this[message +publisher.id+'_handler'] = handler
    }
    return this
  }

  unListen(publisher,message){
    if(publisher instanceof Publish){
      publisher.removeListen(this,message)
    }
  }
}

const juejin = new Publish('juejin')
const programmerA = new Subscribe('programmerA')

programmerA.listen({
  publisher:juejin,
  message:'Javascript',
  handler:(self,info)=>{
    let {title,duration,price}= info
    let result 
  }
})