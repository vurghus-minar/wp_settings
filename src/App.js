import './style.scss';

const { Component } = wp.element;
const { __ } = wp.i18n;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        bla: '',
      },
    };
  }

  componentDidMount() {
    this.ajax('GET')
      .then(res => {
        if (res.success) {
          const options = res.value;
          this.setState({ options });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  ajax(method) {
    const config = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.example_rest_object.nonce,
      },
    };
    return fetch(window.example_rest_object.rest_url, config)
      .then(res => res.json().then(data => (res.ok ? data : Promise.reject(data))))
      .catch(error => {
        Promise.reject(error);
      });
  }

  handleChange(event) {
    this.setState({ bla: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const options = {
      bla: this.state.options.bla,
    };

    // this.ajax('POST');
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
                    value={this.state.options.bla}
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
