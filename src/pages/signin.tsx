import { useRouter } from "next/router";
import { FormEvent, useRef } from "react";

const SignIn = () => {
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (ref.current != null) {
      const data = new FormData(ref.current);
      fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
          id: data.get("id"),
          password: data.get("password"),
        }),
      }).then(async (res) => {
        const { token } = await res.json();
        document.cookie = `token=${token}`;
        router.replace("/");
      });
    }
  };

  return (
    <form ref={ref} onSubmit={handleSubmit}>
      <label>
        <div>ID</div>
        <input type="text" name="id" style={{ padding: 4 }}></input>
      </label>
      <label>
        <div>パスワード</div>
        <input type="password" name="password" style={{ padding: 4 }}></input>
      </label>
      <div>
        <button type="submit" style={{ marginTop: 16 }}>
          ログイン
        </button>
      </div>
    </form>
  );
};

export default SignIn;
