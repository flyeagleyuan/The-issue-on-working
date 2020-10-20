
//test subscribe publish



class Publish{
  constructor(name='publisher'){
    this.messageMap={} //消息事件订阅者集合对象
    //随机id模拟唯一
    this.id = 'id-' + Date.now() + Math.ceil(Math.random()*10000)
    this.name = name
  }

  addListener(subscriber,message){//添加消息订阅者
    if(!subscriber||!message) return false

    if(!this.messageMap[message]){//如果消息列表不存在就新建
      this.messageMap[message]= []
    }

    const existIndex = this.messageMap[message].findIndex(existSubscriber=>existSubscriber.id===subscriber.id)
    if(existIndex===-1){//不存在这个订阅者时添加
      this.messageMap[message].push(subscriber)
    }else{//如果存在这个订阅者，更新回调handler
      this.messageMap[message][existIndex][message+this.id+'_handler']= subscriber[message+this.id+'_handler']
    }
  }
  removeListener(subscriber,message){//删除消息订阅者
    if(!subscriber)return false

    //如果传入message，只删除此message下的订阅关系，否则删除此订阅着的所有订阅关系
    const messages= message?[message]:Object.keys(this.messageMap)

    messages.forEach(messageItem=>{
      const subscribers = this.messageMap[messageItem]
      if(!subscribers) return false
      let i = subscribers.length;
      while(i--){
        if(subscribers[i].id===subscriber.id){
          subscribers.splice(i,1)
        }
      }
      if(!subscribers.length) delete this.messageMap[messageItem]
    })

  }
  publish(message,info){
    const subscribers = this.messageMap[message]|| []
    subscribers.forEach(subscriber=> subscriber[message+'_handler'](info))
    return this
  }
}

class Subscribe {
  constructor(name='subscribe'){
    this.name = name
    //随机ID
    this.id='id-'+Date.now()+Math.ceil(Math.random()*10000)
  }
  listen({
    publisher,//订阅的发布者
    message,//订阅的消息
    handler//收到消息后的处理方法
  }){
    //订阅消息的回调函数
    if(publisher instanceof Publish){
      this[message+publisher.id+'_handler']= handler
      publisher.addListener(this,message)
    }
    return this
  }
  unlisten(publisher,message){
    if(publisher instanceof Publish){
      publisher.removeListener(this,message)
    }
    return this
  }
}

//实例化发布者juejin
const juejin = new Publish('juejin')

//实例化订阅者'程序员A'
 const programmerA = new Subscribe('programmerA')

 programmerA.listen({
   publisher: juejin,
   message:'Javascript',
   handler:(self,info)=>{
    let { title, duration, price } = info

    let result = `title[${title}]-> ${self.name} is not interested in it.`
    if(title === 'closure') {
        result = `title[${title}]-> ${self.name} is interested in it.`
    }
    console.log(`receive the message JavaScript from ${juejin.name}:`, result)
   }
 })
