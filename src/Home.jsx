import React from 'react';
import './Home.css';   
import styled from 'styled-components';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';


const cardsData = [
  {
    title: 'Student Management',
    value: 128,
    icon: <GroupAddIcon id='icon' />,
    link: 'student-mangt',
  },
  {
    title: 'Invoices',
    value: 33,
    icon: <ChatBubbleOutlineIcon id='icon1' />,
    link: 'invoices',
    textColor: true,
  },
  {
    title: 'Assest Management',
    value: 128,
    icon: <SupervisorAccountIcon id='icon' />,
    link: 'asset-mang',
  },
  {
    title: 'Certificate Management',
    value: 128,
    icon: <CardMembershipIcon id='icon1' />,
    link: 'certificate-mang',
    textColor: true,
  },
];

const CardContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin: 10px;
  color: white; 
  background-color: #9975f3;
  width:350px; 

`;

const CardContainer1 = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin: 10px;
  background-color: #f5aef8;
  width: 350px;
`;

function Home() {
  return (
    <div className='body'>
      <Navbar />
      <div className='cards-align'>
        {cardsData.map((card, index) => (
          <div key={index} className={card.textColor ? 'text-color' : ''}>
            {card.textColor ? (
              <CardContainer1>
                <p>{card.title}</p>
                <p>{card.value}</p>
                {card.icon}
                <hr></hr>
                <Link to={card.link} style={{color:'black'}}> {/* Navigate to the 'link' */}
                  View Report <ArrowForwardIosIcon id='arrow-icon1' />
                </Link>
              </CardContainer1>
            ) : (
              <CardContainer>
                <p>{card.title}</p>
                <p>{card.value}</p>
                {card.icon}
                <hr></hr>
                <Link to={card.link}>
                  View Report <ArrowForwardIosIcon id='arrow-icon' />
                </Link>
              </CardContainer>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
  