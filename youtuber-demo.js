// express 모듈 세팅 

const express = require('express')
const app = express()
app.listen(1234)

let youtuber1 = {
    channelTitle : "김구선생", 
    subscriber : "593만명", 
    videoNum : "993개"
}

let youtuber2 = {
    channelTitle : "이구선생", 
    subscriber : "227만명", 
    videoNum : "6600개"
}

let youtuber3 = {
    channelTitle : "최구선생", 
    subscriber : "54.8만명", 
    videoNum : "726개"
}

let db = new Map()     // db에는 number가 들어있다
var id = 1 
db.set(id++, youtuber1)  // 기존 값을 활용하고 +1 해주는 것이기 때문에 처음부터 id++을 해주어야 한다.
db.set(id++, youtuber2)
db.set(id++, youtuber3)


//REST API 설계
//전체 조회 
app.get('/youtubers', function (req,res) {
    
    var youtubers = {} 
    
    db.forEach((youtuber) => {
        youtubers[youtuber.channelTitle] = youtuber   // 데이터를 추가할 때!
    });

    res.json(youtubers)

})

//개별 조회 
app.get('/youtubers/:id', function (req, res) {    
    let {id} = req.params
    id = parseInt(id)

const youtuber = db.get(id)
    if(youtuber === undefined) {
        res.json({
            message : "등록된 유튜버가 없습니다."
        })
    } else {
    res.json(youtuber)
    }      
  })


  //Youtuber 등록
  app.use(express.json()) // json라는 middleware를 사용하면 req로 오는 값을 json으로 볼 수 있다.
app.post('/youtubers', (req, res) => {
    console.log(req.body)
    //등록 => Map(db)에 저장(put)
    db.set(id++, req.body)
    res.json({
        message : `${db.get(id - 1).channelTitle}님, 함께 멋진 추억을 만들어 갑시다!`
    })
})


app.delete('/youtubers/:id', function(req, res){
    let {id} = req.params
    id = parseInt(id)

    var youtuber = db.get(id);

    if(youtuber === undefined) { 
        res.json({
            message : `요청하신 ${id}번은 없는 유튜버입니다.`
        })
    } else { 
        const channelTitle = youtuber.channelTitle
        db.delete(id)
    
        res.json({
            message : `${channelTitle}님, 다음번에 또 뵙겠습니다!`
        })
    }
    


})


app.delete('/youtubers', function(req, res) { 

    var msg = ""
    // db에 값이 1개 이상이면, 전체 삭제
    // 값이 없으면, "삭제할 유튜버가 없습니다."
    if(db.size > 0) { 
        db.clear()
        msg = "전체 유튜버가 삭제되었습니다."
    } else { 
        msg = "삭제할 유튜버가 없습니다."
}

    res.json({
        message : msg
    })

})

app.put('/youtubers/:id', function(req, res){ 
 
    let {id} = req.params
    id = parseInt(id)

    var youtuber = db.get(id);
    var oldTitle = youtuber.channelTitle
    if(youtuber === undefined) { 
        res.json({
            message : `요청하신 ${id}번은 없는 유튜버입니다.`
        })
    } else { 
        
        var newTitle = req.body.channelTitle

        youtuber.channelTitle = newTitle
        db.set(id, youtuber)  // 덮어쓰기 
        
        res.json({
            mesasge : `${oldTitle}님, 채널명이 ${newTitle}로 수정되었습니다.`
        })

    }
})