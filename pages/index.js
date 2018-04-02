import React from 'react'
import Racer from 'racer'
import 'isomorphic-unfetch'

export default class MyPage extends React.Component {
  static async getInitialProps ({ req }) {
    const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
    const res = await fetch(`${baseUrl}/api/documents/1`)
    const modelBundle = await res.json()
    return { modelBundle }
  }

  render () {
    console.log(this.props.modelBundle)
    const model = Racer.createModel(this.props.modelBundle)
    //const $doc = model.at('_page.doc')

    return (
      <div>
        <p>Next.js has  ⭐️</p>
      </div>
    )
  }
}
