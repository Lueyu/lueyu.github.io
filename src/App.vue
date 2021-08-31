<template>
    <!-- <div id="app">
    <feedback></feedback>
    <router-view/>
    </div>-->

    <div id="app">
        <!-- <Feedback/> -->
        <router-view />

        <!-- <div class="footer">
      <div class="links">
        <span>Feature 1</span>
        <span>Feature 2</span>
        <span>Feature 3</span>
      </div>
      <div class="version">Version 1.02.05</div>
        </div>-->
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style lang="scss">
#app {
    font-family: Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    //text-align: center;
    //color: #2c3e50;
    margin: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}
body {
    margin: 0;
    padding: 0;
}
.footer,
.header {
    padding: 20px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    h1,
    h2,
    h3 {
        color: #f0f4f8;
        padding: 0;
        margin: 0;
    }
    // .links {
    //   display: flex;
    //   font-family: "Open Sans";
    //   span {
    //     padding: 0 10px;
    //     font-size: 18px;
    //     border-right: 1px solid #9fb3c8;
    //     &:last-child {
    //       border-right: none;
    //     }
    //   }
    // }
    // .version {
    //   font-family: "Open Sans";
    //   padding: 0 10px;
    //   color: #9fb3c8;
    //   font-size: 12px;
    //   margin-top: 5px;
    // }
}
</style>
