function SearchForm() {
  return (
    <form>
      <div className="input-group mb-3">
        <label className="form-label">펀치 ID: </label>
        <input className="form-control" type="text" placeholder="펀치 ID" />
      </div>

      <div className="input-group mb-3">
        <label className="form-label">등록날짜: </label>
        <input className="form-control" type="date" placeholder="등록날짜" />
      </div>

      <div className="input-group mb-3">
        <label className="form-label">펀치 타입: </label>
        <input className="form-control" type="email" placeholder="펀치 타입" />
      </div>

      <div className="input-group mb-3">
        <label className="form-label">제조사: </label>
        <input
          className="form-control"
          type="email"
          placeholder="Enter email"
        />
      </div>

      <div className="input-group mb-3">
        <label className="form-label">펀치 상태: </label>
        <input className="form-control" type="email" placeholder="펀치 상태" />
      </div>

      <div className="input-group mb-3">
        <label className="form-label">펀치 보관위치: </label>
        <input
          className="form-control"
          type="email"
          placeholder="Enter email"
        />
      </div>

      <div className="input-group mb-3">
        <label className="form-label">제품: </label>
        <input
          className="form-control"
          type="email"
          placeholder="Enter email"
        />
      </div>

      <div className="input-group mb-3">
        <label className="form-label">제품 타입: </label>
        <input
          className="form-control"
          type="email"
          placeholder="Enter email"
        />
      </div>
    </form>
  );
}

export default SearchForm;
