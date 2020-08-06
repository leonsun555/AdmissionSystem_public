export default function ({ store, redirect, app }) {
    // // If the user is not authenticated
    // if (store.state.status !== 'success') {
    //   return redirect('/');
    // }

    var cookies = app.$cookies.get('user-token', { fromRes: true })
    if (!cookies) {
      return redirect('/');
    }
}