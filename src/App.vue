<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="scss">
  .el-message.el-message--error.is-closable {
    .el-message__icon {
      display: none;
    }
  }

  .el-message {
    min-width: 470px;
    min-height: 60px;
  }

  .header--list {
    color: #303133;
    font-size: 18px;
  }

  .text--muted {
    color: lightgray !important;
  }

  div.cell {
    word-break: initial !important;
  }

  .el-card__body {
    height:100%
  }

  .el-tab-pane {
    min-height: 50vh;
  }

  ::-moz-selection { background: lightblue; }
  ::selection { background: lightblue; }

  option {
    &:checked {
      -webkit-appearance: none;
      outline: none;
      background: rgb(122, 199, 224) linear-gradient(0deg, rgb(122, 199, 224) 0%, rgb(122, 199, 224) 100%);
      color: #000 !important;
    }
  }

  .c3-xgrid-focus { display: none; }
  .c3-tooltip td {
    border-left: 0;
  }

  .c3 .c3-axis-x path,
  .c3 .c3-axis-x line,
  .c3 .c3-axis-y path,
  .c3 .c3-axis-y line {
    stroke: #606266;
  }

  .c3 .c3-axis-x g,
  .c3 .c3-axis-y g,
  .c3 .c3-legend-item-data text,
  .c3 .c3-axis-y-label,
  .c3 .c3-axis-x-label,
  .c3 .c3-legend-item {
    fill: #606266;
  }

  .el-button--success {
    .is-disabled {
      background-color: lightgray;
    }
  }

  .help-text {
    font-size: 15px;
    position: relative;
    padding-top: 43px;

    &::before {
      content: 'Tip:';
      position: absolute;
      top: 0;
      left: 0;
      font-size: 20px;
    }
  }

  @keyframes fadein {
    0% {
      transform: translateY(-13px);
    }

    100% {
      transform: translateY(0px);
    }
  }

  .input-v {
    position: relative;

    &::before {
      content: attr(data-error-msg);

      width: 250px;

      position: absolute;
      left: 0;
      bottom: -13px;

      font-size: 12px;
      color: red;

      animation: fadein .2s ease-in;
    }
  }
</style>
