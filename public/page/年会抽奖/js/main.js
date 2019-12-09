var timerFlag = null;
var VM = new Vue({
  el: "#app",
  data: function() {
    return {
      users: [], //抽奖用户数量
      prizeSetting: [
        {
          id: 1,
          key: "one",
          title: "一等奖",
          value: 1 //奖品数量
        },
        {
          id: 2,
          key: "two",
          title: "二等奖",
          value: 4 //奖品数量
        },
        {
          id: 3,
          key: "three",
          title: "三等奖",
          value: 10 //奖品数量
        }
      ],
      choicePrize: {}, //当前选择的奖品
      currentUser: {}, //当前中奖者
      currentUserList: JSON.parse(localStorage.getItem("one")) || [],
      currentUserList2: JSON.parse(localStorage.getItem("two")) || [],
      currentUserList3: JSON.parse(localStorage.getItem("three")) || [],
      lotteryBtn: "开始抽奖"
    };
  },
  methods: {
    initData: function() {
      this.getUserData();
      this.choicePrize = this.prizeSetting[0];
    },
    choicePrizeFun: function() {
      console.log(this.choicePrize);
      this.lotteryBtn = "开始抽奖";
    },
    getUserData: function() {
      var _this = this;
      $.get("../data/user.json", function(user) {
        _this.users = user;
      });
    },
    hideUserPhoneFourNumber: function(phone) {
      if (phone) {
        return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
      } else {
        return "";
      }
    },
    startOrStop: function(params) {
      if (this.lotteryBtn === "结束抽奖") {
        console.log(this.lotteryBtn);
        clearInterval(timerFlag);
        timerFlag = null;
        this.lottery();
      } else if (this.lotteryBtn === "开始抽奖") {
        if (timerFlag === null) {
          timerFlag = setInterval(() => {
            this.currentUser = this.users[this.getRandomIndex()];
          }, 100);
        }
        this.lotteryBtn = "结束抽奖";
      }
    },
    lottery: function() {
      var count = this.choicePrize.value; //抽奖次数;
      var prizeType = this.choicePrize.id;
      var index = 0;
      var timer = null;
      var _this = this;
      console.log(count + " count");
      for (var i = 0; i < count; i++) {
        var index = i * 2500;
        var index1 = 2000 * (i + 1);
        (function(i) {
          //   console.log(index + "==========" + index1);
          //   timer = null;
          //   setTimeout(() => {
          console.log(timer);
          if (timer === null) {
            timer = setInterval(() => {
              _this.currentUser = _.difference(
                _this.users,
                _this.currentUserList,
                _this.currentUserList2,
                _this.currentUserList3
              )[_this.getRandomIndex()];
            }, 100);
          }
          //   }, index);
          setTimeout(() => {
            // console.log("=======================" + parseInt(prizeType));
            if (parseInt(prizeType) === 1) {
              if (_this.lotteryBtn === "结束抽奖") {
                _this.currentUserList.push(_this.currentUser);
              }
              if (_this.currentUserList.length >= count) {
                localStorage.setItem(
                  "one",
                  JSON.stringify(_this.currentUserList)
                );
                clearInterval(timer);
              }
            } else if (parseInt(prizeType) === 2) {
              if (_this.lotteryBtn === "结束抽奖") {
                _this.currentUserList2.push(_this.currentUser);
              }
              if (_this.currentUserList2.length >= count) {
                localStorage.setItem(
                  "two",
                  JSON.stringify(_this.currentUserList2)
                );
                clearInterval(timer);
              }
            } else if (parseInt(prizeType) === 3) {
              if (_this.lotteryBtn === "结束抽奖") {
                _this.currentUserList3.push(_this.currentUser);
              }
              if (_this.currentUserList3.length >= count) {
                localStorage.setItem(
                  "three",
                  JSON.stringify(_this.currentUserList3)
                );
                clearInterval(timer);
              }
            }
          }, (i + 1) * 3000);
        })(i);
      }
    },
    getRandomIndex: function() {
      var index = Math.floor(
        Math.random() *
          _.difference(
            this.users,
            this.currentUserList,
            this.currentUserList2,
            this.currentUserList3
          ).length
      );
      return index;
    },
    lettoryResultReset: function() {
      //开奖结果重置
      var prizeType = this.choicePrize.id;
      var result = confirm("重新抽奖，会清空历史数据，不可恢复，确认继续?");
      if (true) {
        if (parseInt(prizeType) === 1) {
          localStorage.removeItem("one");
          this.currentUserList = [];
        } else if (parseInt(prizeType) === 2) {
          localStorage.removeItem("two");
          this.currentUserList2 = [];
        } else if (parseInt(prizeType) === 3) {
          localStorage.removeItem("three");
          this.currentUserList3 = [];
        }
      }
    }
  },
  computed: {
    renderResultList: function() {
      var prizeType = this.choicePrize.id;
      if (parseInt(prizeType) === 1) {
        return this.currentUserList;
      } else if (parseInt(prizeType) === 2) {
        return this.currentUserList2;
      } else if (parseInt(prizeType) === 3) {
        return this.currentUserList3;
      }
    }
  },
  mounted: function() {
    this.initData();
    console.log("hello vue!!!");
  }
});
