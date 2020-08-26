export const myMixIn = {
  methods: {
    giveMoney(money) {
      this.$parent.money += money;
      this.money -= money;
    },
  },
};
