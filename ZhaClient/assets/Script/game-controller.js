import global from "./global";
const EventListener = require("event-listener");

cc.Class({
    extends: cc.Component,

    properties: {
        main_world_prefab:{
            default: null,
            type:cc.Prefab
        },
        game_world_prefab:{
            default: null,
            type:cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {
        global.socket = io("localhost:3000");
        global.eventlistener = EventListener({});
        global.eventlistener.on("login",  (uid) => {
            console.log("login a person " + uid);
            global.socket.emit("login", uid);
        });

        global.socket.on("sync_data",  (data) => {
           console.log("sync_data " + JSON.stringify(data));
            this.enterGameWorld(data);
        });

        //创建玩家
        global.socket.on("player_join", (data) => {
           global.eventlistener.fires("player_join", data);
        });
        this.enterMainWorld();
    },

    enterMainWorld:function () {
      if(this.runningWorld != undefined){
          this.runningWorld.removeFromParent(true);
      }

      this.runningWorld = cc.instantiate(this.main_world_prefab);
      this.runningWorld.parent = this.node;
    },
    
    enterGameWorld: function (data) {
        if(this.runningWorld != undefined){
            console.log("enterGameWorld skdhfskfh");
            this.runningWorld.destroy();
        }
        console.log("enterGameWorld " + JSON.stringify(data));
        this.runningWorld = cc.instantiate(this.game_world_prefab);
        this.runningWorld.parent = this.node;

        global.eventlistener.fires("sync_data", data);
    },
});
