import { Guid } from 'guid-typescript';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useToasterMessage } from '../../custom-hooks/authorize-provider';
import ToasterItem from './toaster-item';
export default function Toaster() {
  const [messages, setMessages] = useToasterMessage();
  useEffect(
    () => {
      var timer = setInterval(() => {
        setMessages((r) =>
          r.map((x, i) => {
            return { ...x, time: x.idle || i >= 5 ? x.time : x.time - 1 };
          })
        );
        setMessages((r) => r.filter((x) => x.time > 0));
      }, 500);
      if (!messages.length) {
        clearInterval(timer);
      }
      return () => {
        clearInterval(timer);
      };
    },
    //eslint-disable-next-line
    [messages]
  );
  function mouseOver(id: Guid) {
    setMessages((r) =>
      r.map((x) => {
        if (x.id === id) {
          x.idle = true;
        }
        return x;
      })
    );
  }
  function mouseLeave(id: Guid) {
    setMessages((r) =>
      r.map((x) => {
        if (x.id === id) {
          x.idle = false;
        }
        return x;
      })
    );
  }

  return ReactDOM.createPortal(
    <div className='toaster-main-container'>
      {messages
        .filter((x, i) => i < 5)
        .map((r) => (
          <ToasterItem
            key={r.id.toString()}
            time={r.time}
            title={r.title ?? ''}
            content={r.content}
            onMouseOver={() => {
              mouseOver(r.id);
            }}
            onMouseLeave={() => {
              mouseLeave(r.id);
            }}
          />
        ))}
    </div>,
    document.getElementById('modal') as HTMLElement
  );
}
