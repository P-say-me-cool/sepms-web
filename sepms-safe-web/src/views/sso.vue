<template>
</template>

<script>
import { setExpiresIn, setToken } from '@/utils/auth'
import { loginSSO } from '@/api/login'

   export default {

      data() {

         return {
         }
      },
      created() {
         let token = this.$route.query.token;
         console.log(token);
         this.handleSso(token);
      },
      methods: {
        handleSso(token) {
          return new Promise((resolve, reject) => {
            loginSSO(token).then(res => {
              let data = res.data
              setToken(data.access_token)
              this.$store.state.token = data.access_token
              setExpiresIn(data.expires_in)
              this.$store.state.expires_in = data.expires_in
              this.$router.push({ path: this.redirect || '/' }).catch(() => {
              })
              resolve()
            }).catch(error => {
              reject(error)
            })
          })
         }
      }
   }
</script>
