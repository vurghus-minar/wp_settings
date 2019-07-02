import './style.scss';

const { Component } = wp.element;
const { __ } = wp.i18n;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bla: '',
      aha: '',
      zaz: {
        fafa: '',
        tut: '',
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.ajax('GET')
      .then(res => {
        if (res.success) {
          const options = res.value;
          this.setState({ ...options });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  ajax(method, body = '') {
    const config = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.example_rest_object.nonce,
      },
    };
    if (body) {
      config.body = body;
    }
    return fetch(window.example_rest_object.rest_url, config)
      .then(res => res.json().then(data => (res.ok ? data : Promise.reject(data))))
      .catch(error => {
        Promise.reject(error);
      });
  }

  handleChange(event) {
    const { name, value, type, checked } = event.target;
    if (name.startsWith('zaz')) {
      const prop = name.split('.')[1];
      const zaz = { ...this.state.zaz };
      zaz[prop] = value;
      this.setState({ zaz });
    } else {
      type === 'checkbox' ? this.setState({ [name]: checked }) : this.setState({ [name]: value });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('Form Submitted!');
    this.ajax('POST', JSON.stringify(this.state))
      .then((res, error) => {
        if (error) {
          console.log(error);
        }

        if (res.success) {
          const options = res.value;
          this.setState({ ...options });
          console.log(options);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <section className="settings-form">
        <form onSubmit={this.handleSubmit}>
          <table className="form-table">
            <tbody>
              <tr>
                <th scope="row">
                  <label>{__('Bla:', 'am-boilerplate-plugin')}</label>
                </th>
                <td>
                  <input
                    className="regular-text"
                    type="text"
                    name="bla"
                    value={this.state.bla}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th scope="row">
                  <label>{__('Aha:', 'am-boilerplate-plugin')}</label>
                </th>
                <td>
                  <input
                    className="regular-text"
                    type="text"
                    name="aha"
                    value={this.state.aha}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th scope="row">
                  <label>{__('Zaz Fafa:', 'am-boilerplate-plugin')}</label>
                </th>
                <td>
                  <input
                    className="regular-text"
                    type="text"
                    name="zaz.fafa"
                    value={this.state.zaz.fafa}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th scope="row">
                  <label>{__('Zaz Tut:', 'am-boilerplate-plugin')}</label>
                </th>
                <td>
                  <input
                    className="regular-text"
                    type="text"
                    name="zaz.tut"
                    value={this.state.zaz.tut}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <p className="submit">
            <button className="button button-primary" type="submit">
              Save
            </button>
          </p>
        </form>
      </section>
    );
  }
}
