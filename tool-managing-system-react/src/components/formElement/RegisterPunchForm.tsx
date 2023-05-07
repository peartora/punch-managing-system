function RegisterForm() {
  const today = new Date().toISOString().substr(0, 10);

  const options = ["상부", "하부", "다이"];

  return (
    <form>
      <div className="input-group mb-3">
        <label className="form-label">시작 번호: </label>
        <input className="form-control" type="text" placeholder="시작 번호" />
      </div>

      <div className="input-group mb-3">
        <label className="form-label">마지막 번호: </label>
        <input className="form-control" type="text" placeholder="마지막 번호" />
      </div>

      <div className="input-group mb-3">
        <label className="form-label">등록날짜: </label>
        <input
          className="form-control"
          type="date"
          defaultValue={today}
          placeholder="등록날짜"
        />
      </div>

      <div className="input-group mb-3">
        <label className="form-label">펀치타입: </label>
        <select className="form-control" value="option">
          {options.map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="input-group mb-3">
        <label className="form-label">제조사: </label>
        <input
          className="form-control"
          type="date"
          defaultValue={today}
          placeholder="제조사"
        />
      </div>

      <div className="input-group mb-3">
        <label className="form-label">규격서: </label>
        <input
          className="form-control"
          type="date"
          defaultValue={today}
          placeholder="규격서"
        />
      </div>

      <div className="input-group mb-3">
        <label className="form-label">보관위치: </label>
        <input
          className="form-control"
          type="date"
          defaultValue={today}
          placeholder="보관위치"
        />
      </div>
    </form>
  );
}

export default RegisterForm;
