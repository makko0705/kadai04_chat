
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
    import { getDatabase, ref, push, set, update, remove, onChildAdded, onChildRemoved, onChildChanged} 
    from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
  
import firebaseConfig from "./firebaseApikey.js";
  
    // Initialize Firebase
    const app = initializeApp(firebaseConfig); //firebaseConfigを接続する
    const db = getDatabase(app); //リアルタイムデータベースにアクセスする
    const dbRef = ref(db,"chat");

    //***************時間を整形する***************
    // クラスのインスタンス化
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month =String(currentDate.getMonth() + 1).padStart(2,"0") ;
    const day = String(currentDate.getDate()).padStart(2,"0") ;
    const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
    const weekNumber = currentDate.getDay();
    const currentweek = dayOfWeek[weekNumber];
    const hour = currentDate.getHours();
    const min = currentDate.getMinutes();
    //const sec = currentDate.getSeconds();
    //const msec = currentDate.getMilliseconds();
    const imanohinichi = `${month}/${day}`;
    const imanojikan = `${hour}:${min}`;


$("#send").on("click",function(){
        const msg = { //オブジェクトを生成する
             uname : $("#uname").val(),
             text : $("#text").val(),
             color : $("#color").val(),
            day :imanohinichi,
            time : imanojikan
        }
        const newPostRef = push(dbRef);//ユニークキーを生成
        set(newPostRef,msg);
        $("#text").val(""); //送信したらtextareaから消す

    });
    //最初にデータ取得&onsnapshotでリアルタイムにデータ取得
    onChildAdded(dbRef,function(data){
        const msg = data.val();
        const key = data.key;//ユニークKEY 削除更新に必須
        const myname = $("#uname").val();
        console.log("わたしのなまえは"+myname+"です");

        let h = '<div id="'+key+'" class="'+msg.uname+' chat_item">';
            h += '<p class="name name_'+msg.uname+'">'+msg.uname+'</p>';
            h += '<p class="balloon">';
            h += '<span contentEditable="true" id="'+key+'_update" class="text">'+msg.text+'</span>';
            h += '<span class="remove" data-key="'+key+'"><img src="img/btn_remove.png" alt=""></span>'
            h += '<span class="update" data-key="'+key+'"><img src="img/btn_update.png" alt=""></span>'
            h += '<time class="time"><span>'+msg.day+'</span><span>'+msg.time+'</span></time>';
            h += '</p>';
            h += '</div>';
            $("#output").append(h);

        //アイコンの色を設定
        const uname_class = `.name_${msg.uname}`;
        if (msg.uname) {
            $(uname_class).css("background",msg.color);
        }
        //入力した名前とfirebaseの名前が一緒だったら右寄せにする
        if (msg.uname == myname) {
            $(uname_class).parent().addClass("its_me");
        }
        //常にに一番下の吹き出しを表示させる
            $("#output").animate({ scrollTop: $('#output').prop("scrollHeight")}, 1000);
            //$('#output').scrollTop($('#output')[0].scrollHeight);
    });

    //削除イベント
    $("#output").on("click",".remove",function(){
        const key = $(this).attr("data-key");
        const remove_item = ref(db,"chat/"+key);
        remove(remove_item);
    });

    //更新イベント
    $("#output").on("click",".update", function(){
        const key = $(this).attr("data-key");
        update(ref(db, "chat/"+key),{
            text: $("#"+key+"_update").html()
        });
    });

    //削除処理がfirebase側で実行されたらイベント発生
    onChildRemoved(dbRef, (data) => {
        $("#"+data.key).remove();//DOM操作関数 (対象を削除)
    });

    // 更新処理がFirebase側で実行されたらイベント発生
  onChildChanged(dbRef, (data) => {
    $("#"+data.key+'_update').html(data.val().text);
    $("#"+data.key+'_update').fadeOut(800).fadeIn(800);
  });
