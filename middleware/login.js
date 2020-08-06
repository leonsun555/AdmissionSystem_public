export default function ({ store, redirect, app }) {
    // // If the user is not authenticated
    // if (store.state.status !== 'success') {
    //   return redirect('/');
    // }
    console.log('test1');
    var cookieRes = app.$cookies.get('user-token', { fromRes: true })
    console.log('test2');
    console.log(cookieRes);
    if (cookieRes) {
      return redirect('/score');
    }
}